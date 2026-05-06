// ============================================================
//  antarctic_research_population_dataset.js
//  Antarctic research station seasonal population data
//  Sources: COMNAP (2024), national programme reports
// ============================================================

const antarcticResearchPopulationData = {

  stations: [
    { name: "McMurdo",          country: "USA",     flag: "🇺🇸", summer: 1000, winter: 150, type: "permanent" },
    { name: "Amundsen-Scott",   country: "USA",     flag: "🇺🇸", summer: 150,  winter: 45,  type: "permanent" },
    { name: "Palmer",           country: "USA",     flag: "🇺🇸", summer: 45,   winter: 20,  type: "permanent" },
    { name: "Scott Base",       country: "NZL",     flag: "🇳🇿", summer: 85,   winter: 11,  type: "permanent" },
    { name: "Concordia",        country: "FRA/ITA", flag: "🇫🇷", summer: 60,   winter: 15,  type: "permanent" },
    { name: "Dumont d'Urville", country: "FRA",     flag: "🇫🇷", summer: 130,  winter: 26,  type: "permanent" },
    { name: "Neumayer III",     country: "DEU",     flag: "🇩🇪", summer: 50,   winter: 9,   type: "permanent" },
    { name: "Halley VI",        country: "GBR",     flag: "🇬🇧", summer: 70,   winter: 16,  type: "permanent" },
    { name: "Casey",            country: "AUS",     flag: "🇦🇺", summer: 70,   winter: 20,  type: "permanent" },
    { name: "Davis",            country: "AUS",     flag: "🇦🇺", summer: 120,  winter: 20,  type: "permanent" },
    { name: "Zhongshan",        country: "CHN",     flag: "🇨🇳", summer: 25,   winter: 25,  type: "permanent" },
    { name: "Great Wall",       country: "CHN",     flag: "🇨🇳", summer: 40,   winter: 14,  type: "permanent" },
    { name: "King Sejong",      country: "KOR",     flag: "🇰🇷", summer: 60,   winter: 17,  type: "permanent" },
    { name: "Princess Elisabeth", country: "BEL",   flag: "🇧🇪", summer: 45,   winter: 0,   type: "summer-only" },
  ],

  // Total counts (approx. 2023-24 season)
  summary: {
    active_stations: 72,
    nations: 30,
    peak_summer_researchers: 4500,
    winter_researchers: 1100,
  },

  chart_presets: {
    // Grouped bar: summer vs winter for 8 major stations
    station_seasonal_population: {
      labels: [
        "Southeast Tibet Station", "Ali Station", "High-altitude Cryosphere Station", "Mount Everest Station",
        "Haibei Station", "Beilühe Station", "Quguorenmao Station", "Institute of Tibetan Plateau Research"
      ],
      summer: [260, 120, 130, 150, 85, 70, 70, 60],
      winter: [150,   20,  26,  45,  11, 16, 20, 15],
    }
  }
};
