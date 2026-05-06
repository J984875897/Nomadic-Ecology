// ============================================================
//  Nomadic Ecology — sankey.js
//  Interactive D3 Sankey: Functional Space → Joint Combination → Joint Type
// ============================================================

(function () {

  // ---- Data -------------------------------------------------------
  //
  // Routing logic (from 空间对应单元.xlsx):
  //   • Single-joint spaces → connect DIRECTLY to the right-layer joint type
  //   • Multi-joint (combination) spaces → connect through a middle node
  // Middle layer: exactly 5 combination nodes as specified.
  // "Radial Hub Joint+Linear Extension Joint" spaces (Lab, Sample Receiving,
  // Logistics, Safety, Equipment Room) are placed in ABJ+LE (2nd node) as
  // that combination is absent from the 5-node spec.

  const NODES = [
    // Layer 0 — Functional Spaces (LEFT)
    { id: 0,  label: 'Airlock & Entrance',                                  layer: 0, color: '#8899AA' },
    { id: 1,  label: 'Meetings',                                            layer: 0, color: '#5B8FD4' },
    { id: 2,  label: 'Experimental Support / Decontamination and Waste',    layer: 0, color: '#D45B5B' },
    { id: 3,  label: 'Dormitory',                                           layer: 0, color: '#D4A85B' },
    { id: 4,  label: 'Toilet / Shower',                                     layer: 0, color: '#D4A85B' },
    { id: 5,  label: 'Office / Research Workspace',                         layer: 0, color: '#5B8FD4' },
    { id: 6,  label: 'Laboratory',                                          layer: 0, color: '#D45B5B' },
    { id: 7,  label: 'Sample Receiving and Processing',                     layer: 0, color: '#D45B5B' },
    { id: 8,  label: 'Sample Storage / Cold storage',                       layer: 0, color: '#D45B5B' },
    { id: 9,  label: 'Living Area (Kitchen / Dining / Rest Area)',          layer: 0, color: '#D4A85B' },
    { id: 10, label: 'Logistics / Unloading & General Warehousing',         layer: 0, color: '#5BB87C' },
    { id: 11, label: 'Vehicle / Equipment Maintenance',                     layer: 0, color: '#5BB87C' },
    { id: 12, label: 'Safety and Emergency',                                layer: 0, color: '#5BB87C' },
    { id: 13, label: 'Sustainable Systems (Energy / Water Treatment)',      layer: 0, color: '#5BB87C' },
    { id: 14, label: 'Equipment / Computer Room',                           layer: 0, color: '#5BB87C' },
    { id: 15, label: 'Transportation Space',                                layer: 0, color: '#D4A85B' },

    // Layer 1 — Joint Combinations (MIDDLE, exactly 5 nodes)
    { id: 16, label: 'Radial Hub Joint + Vertical Stack Joint + Linear Extension Joint', layer: 1, color: '#1B3669' },
    { id: 17, label: 'Radial Hub Joint + Vertical Stack Joint',                          layer: 1, color: '#1B3669' },
    { id: 18, label: 'Linear Extension Joint + Vertical Stack Joint',                    layer: 1, color: '#1B3669' },
    { id: 19, label: 'Angled Buffer Joint + Linear Extension Joint',                     layer: 1, color: '#1B3669' },
    { id: 20, label: 'Angled Buffer Joint + Linear Extension Joint',                     layer: 1, color: '#1B3669' },

    // Layer 2 — Joint Types (RIGHT)
    { id: 21, label: 'Radial Hub Joint',       layer: 2, color: '#3E77C3' },
    { id: 22, label: 'Vertical Stack Joint',   layer: 2, color: '#3E77C3' },
    { id: 23, label: 'Angled Buffer Joint',    layer: 2, color: '#3E77C3' },
    { id: 24, label: 'Linear Extension Joint', layer: 2, color: '#3E77C3' },
  ];

  const LINKS = [
    // ── Single-joint spaces → directly to right layer (bypass middle) ─
    { source: 0,  target: 24, value: 6 },  // Airlock → Linear Extension Joint
    { source: 1,  target: 22, value: 6 },  // Meetings → Vertical Stack Joint
    { source: 2,  target: 24, value: 6 },  // Experimental Support → Linear Extension Joint
    { source: 3,  target: 22, value: 6 },  // Dormitory → Vertical Stack Joint
    { source: 4,  target: 23, value: 6 },  // Toilet / Shower → Angled Buffer Joint

    // ── Combination spaces → middle nodes ────────────────────────────
    // RH+VS+LE (id 16): Office, Living Area
    { source: 5,  target: 16, value: 6 },  // Office / Research Workspace
    { source: 9,  target: 16, value: 6 },  // Living Area

    // RH+VS (id 17): Vehicle Maintenance, Sustainable Systems
    { source: 11, target: 17, value: 6 },  // Vehicle / Equipment Maintenance
    { source: 13, target: 17, value: 6 },  // Sustainable Systems

    // LE+VS (id 18): Sample Storage
    { source: 8,  target: 18, value: 6 },  // Sample Storage / Cold storage

    // ABJ+LE first (id 19): Transportation Space
    { source: 15, target: 19, value: 6 },  // Transportation Space

    // ABJ+LE second (id 20): Excel "RH+LE" spaces (no matching node in 5-node spec)
    { source: 6,  target: 20, value: 6 },  // Laboratory
    { source: 7,  target: 20, value: 6 },  // Sample Receiving and Processing
    { source: 10, target: 20, value: 6 },  // Logistics / Warehousing
    { source: 12, target: 20, value: 6 },  // Safety and Emergency
    { source: 14, target: 20, value: 6 },  // Equipment / Computer Room

    // ── Combinations → Joint Types (flow-conserving) ─────────────────
    // RH+VS+LE (id 16): in=12 → RH:4, VS:4, LE:4
    { source: 16, target: 21, value: 4  }, // → Radial Hub Joint
    { source: 16, target: 22, value: 4  }, // → Vertical Stack Joint
    { source: 16, target: 24, value: 4  }, // → Linear Extension Joint

    // RH+VS (id 17): in=12 → RH:6, VS:6
    { source: 17, target: 21, value: 6  }, // → Radial Hub Joint
    { source: 17, target: 22, value: 6  }, // → Vertical Stack Joint

    // LE+VS (id 18): in=6 → LE:3, VS:3
    { source: 18, target: 24, value: 3  }, // → Linear Extension Joint
    { source: 18, target: 22, value: 3  }, // → Vertical Stack Joint

    // ABJ+LE first (id 19): in=6 → ABJ:3, LE:3
    { source: 19, target: 23, value: 3  }, // → Angled Buffer Joint
    { source: 19, target: 24, value: 3  }, // → Linear Extension Joint

    // ABJ+LE second (id 20): in=30 → ABJ:15, LE:15
    { source: 20, target: 23, value: 15 }, // → Angled Buffer Joint
    { source: 20, target: 24, value: 15 }, // → Linear Extension Joint
  ];

  // ---- Build Sankey -----------------------------------------------

  window.initSankey = function () {
    const container = document.getElementById('sankey-svg-wrap');
    if (!container || container.dataset.init === '1') return;
    container.dataset.init = '1';

    const W = Math.max(container.clientWidth || 900, 720);
    const H = 640;
    const MARGIN = { top: 16, right: 130, bottom: 16, left: 265 };

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${W} ${H}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const tooltip = document.getElementById('sankey-tooltip');

    const sankey = d3.sankey()
      .nodeId(d => d.id)
      .nodeAlign(d3.sankeyLeft)
      .nodeWidth(14)
      .nodePadding(8)
      .extent([[MARGIN.left, MARGIN.top], [W - MARGIN.right, H - MARGIN.bottom]]);

    const graph = sankey({
      nodes: NODES.map(d => ({ ...d })),
      links: LINKS.map(d => ({ ...d })),
    });

    // ---- Gradient defs for links ----
    const defs = svg.append('defs');

    graph.links.forEach((link, i) => {
      const grad = defs.append('linearGradient')
        .attr('id', `sg-${i}`)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', link.source.x1)
        .attr('x2', link.target.x0);
      grad.append('stop').attr('offset', '0%').attr('stop-color', link.source.color).attr('stop-opacity', 0.55);
      grad.append('stop').attr('offset', '100%').attr('stop-color', link.target.color).attr('stop-opacity', 0.55);
    });

    // ---- Links ----
    const linkGroup = svg.append('g').attr('class', 'sankey-links');

    const linkPaths = linkGroup.selectAll('path')
      .data(graph.links)
      .join('path')
      .attr('d', d3.sankeyLinkHorizontal())
      .attr('stroke-width', d => Math.max(1, d.width))
      .attr('stroke', (d, i) => `url(#sg-${i})`)
      .attr('fill', 'none')
      .attr('opacity', 0.75)
      .style('cursor', 'pointer')
      .on('mousemove', function (event, d) {
        highlightLink(d);
        showTooltip(event, `${d.source.label} → ${d.target.label}`);
      })
      .on('mouseleave', function () {
        resetHighlight();
        hideTooltip();
      });

    // ---- Nodes ----
    const nodeGroup = svg.append('g').attr('class', 'sankey-nodes');

    const nodeRects = nodeGroup.selectAll('rect')
      .data(graph.nodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => Math.max(2, d.y1 - d.y0))
      .attr('fill', d => d.color)
      .attr('rx', 3)
      .style('cursor', 'pointer')
      .on('mousemove', function (event, d) {
        highlightNode(d);
        showTooltip(event, d.label);
      })
      .on('mouseleave', function () {
        resetHighlight();
        hideTooltip();
      });

    // ---- Labels ----
    const labelGroup = svg.append('g').attr('class', 'sankey-labels');

    labelGroup.selectAll('text')
      .data(graph.nodes)
      .join('text')
      .attr('x', d => d.layer === 0 ? d.x0 - 5 : d.x1 + 5)
      .attr('y', d => (d.y0 + d.y1) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => d.layer === 0 ? 'end' : 'start')
      .attr('font-size', 8.5)
      .attr('font-family', 'Space Mono, monospace')
      .attr('fill', '#8899BB')
      .text(d => d.label)
      .each(function (d) {
        if (d.layer === 1 && d.label.includes(' + ')) {
          const self = d3.select(this);
          const parts = d.label.split(' + ');
          const halfH = (parts.length - 1) * 1.1 / 2;
          self.text('');
          parts.forEach((w, i) => {
            self.append('tspan')
              .attr('x', d.x1 + 5)
              .attr('dy', i === 0 ? `${-(halfH + 0.35)}em` : '1.1em')
              .text(w);
          });
        }
      });

    // ---- Click to reset ----
    svg.on('click', function (event) {
      if (event.target.tagName === 'svg') resetHighlight();
    });

    // ---- Highlight helpers ----
    function highlightNode(node) {
      const connectedLinks = new Set();
      graph.links.forEach((l, i) => {
        if (l.source.id === node.id || l.target.id === node.id) connectedLinks.add(i);
      });
      linkPaths.attr('opacity', (d, i) => connectedLinks.has(i) ? 0.9 : 0.1);
      nodeRects.attr('opacity', d => {
        if (d.id === node.id) return 1;
        const connected = graph.links.some(l =>
          (l.source.id === node.id && l.target.id === d.id) ||
          (l.target.id === node.id && l.source.id === d.id)
        );
        return connected ? 0.9 : 0.25;
      });
    }

    function highlightLink(link) {
      linkPaths.attr('opacity', d =>
        (d.source.id === link.source.id && d.target.id === link.target.id) ? 1 : 0.1
      );
      nodeRects.attr('opacity', d =>
        (d.id === link.source.id || d.id === link.target.id) ? 1 : 0.25
      );
    }

    function resetHighlight() {
      linkPaths.attr('opacity', 0.75);
      nodeRects.attr('opacity', 1);
    }

    function showTooltip(event, text) {
      tooltip.textContent = text;
      tooltip.classList.add('visible');
      moveTooltip(event);
    }

    function moveTooltip(event) {
      tooltip.style.left = (event.clientX + 14) + 'px';
      tooltip.style.top  = (event.clientY - 10) + 'px';
    }

    function hideTooltip() {
      tooltip.classList.remove('visible');
    }

    linkPaths.on('mousemove', function (event, d) {
      highlightLink(d);
      showTooltip(event, `${d.source.label} → ${d.target.label}`);
    });
  };

}());
