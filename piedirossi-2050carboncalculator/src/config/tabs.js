export const Tabs = [
  {
    "title": "Overview",
    "route": "overview",
    "subtabs": [
      {"title": "Emissions / Primary Energy", "charts": ["GreenhouseGasEmissions", "PrimaryEnergyConsumption"], "component": "TwoCharts", "route": "emissions-and-primary-energy-consumption"},
          // Info about Chart-Type is inside the chart-definition
      {"title": "Cumulative Emissions / Final Energy", "charts": ["CumulativeGHGEmissions", "FinalEnergyConsumption"], "component": "TwoCharts", "route": "cumulative-emissions-and-final-energy-consumption"},
    ]
  },
  {
    "title": "Transport",
    "route": "transport",
    "subtabs": [
      {"title": "Energy & Emissions", "charts": ["EmissionsTransport", "EnergyConsumptionTransport"], "component": "TwoCharts",  "route": "energy-and-emissions"},
      {"title": "Demand & Technology", "charts": ["PassengerDistanceTravelled", "RoadTransportEnergyConsumptionByEngineType"], "component": "TwoCharts", "route": "demand-and-technology"},
    ]
  },
  {
    "title": "Buildings",
    "route": "buildings",
    "subtabs": [
      {"title": "Energy & Emissions", "charts": ["EmissionsBuildings", "EnergyConsumptionBuildings"], "component": "TwoCharts",  "route": "energy-and-emissions"},
      {"title": "Heat", "charts": ["HeatSupplied", "HeatDemand"], "component": "TwoCharts", "route": "heat"},
    ]
  },
  {
    "title": "Industry",
    "route": "industry",
    "subtabs": [
      {"title": "Energy & Emissions", "charts": ["EmissionsIndustry", "EnergyConsumptionIndustry"], "component": "TwoCharts",  "route": "energy-and-emissions"},
    ]
  },
  {
    "title": "CO2 Removal & Gases",
    "route": "gases",
    "subtabs": [
      {"title": "Emissions Removal", "charts": ["EmissionsRemoval", "CumulativeEmissionsStored"], "component": "TwoCharts",  "route": "emissions-removal"},
      {"title": "Gas Grid & Hydrogen", "charts": ["GasDistributionGridEnergySupplied", "HydrogenSupply"], "component": "TwoCharts",  "route": "gas-grid-hydrogen"}
    ]
  },
  {
    //story.js view in old app, not electricity.js
    "title": "Electricity",
    "route": "electricity",
    "subtabs": [
      {"title": "Emissions/Generation", "charts": ["EmissionsElectricityGeneration", "ElectricitySupply"], "component": "TwoCharts",  "route": "emissions-generation"},
      {"title": "Capacity & Peak", "charts": ["ElectricalCapacity", "PeakGatePowerDemand"], "component": "TwoCharts",  "route": "capacity-peak"}
    ]
  },
  {
    "title": "Land Use & Bioenergy",
    "route": "land-use",
    "subtabs": [
      {"title": "Emissions & Land", "charts": ["EmissionsLandUse", "LandAreaTradeOff"], "component": "TwoCharts",  "route": "emissions-land"},
      {"title": "Bioenergy", "charts": ["DomesticBioenergyProduction", "ImportedBioenergy"], "component": "TwoCharts",  "route": "bioenergy"}
    ]
  },
  {
    "title": "Imports, Map & Flows",
    "route": "imports-map-flows",
    "subtabs": [
      {"title": "Imports", "charts": ["EnergyImports", "EnergyImportDependence"], "component": "TwoCharts",  "route": "imports"},
      // {"title": "Map", "charts": ["Map"], "component": "MapChart",  "route": "map"},
      {"title": "Map", "component": "MapChart",  "route": "map"},
      {"title": "Flows", "component": "Flows",  "route": "flows"}
      // {"title": "Map", "charts": ["DomesticBioenergyProduction", "ImportedBioenergy"], "component": "TwoCharts",  "route": "map"}
    ]
  }
  // {
  //   "title": "Testing",
  //   "route": "testing",
  //   "subtabs": [
  //     {"title": "testing", "component": "OutputTesting",  "route": "testing"},
  //   ]
  // }
]
