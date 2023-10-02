// define sets of outputs per chart, because the API still sends more outputs than necessary (also badly formatted ones)
// the front-end will only use the outputs which are defined here

export const Charts = {
  //Overview
  GreenhouseGasEmissions: {
    pathwayProperty: "emissions_sector",
    chart: {
      component: "StackedAreaChart",
      title: "Greenhouse Gas Emissions",
      unit: "Mt.CO2e/yr"
      // yMin: -250,
      // yMax: 750
      // outputFormatter
      // chartReferenceLines
    },
    outputs: [
      {id:"Dedicated GHG Removal", color:"orange"},
      {id:"Electricity Generation", color:"yellow"},
      {id:"Hydrogen Production", color:"purple"},
      {id:"Other Energy Supply", color:"lightgrey"},
      {id:"Waste Management", color:"darkgreen"},
      {id:"Agriculture & Land Use", color:"lightgreen"},
      {id:"Industry", color:"darkgrey"},
      {id:"Buildings-Residential", color:"lightbrown"},
      {id:"Buildings-Non-Residential", color:"darkbrown"},
      {id:"Transport-Domestic", color:"blue"},
      {id:"Transport-International", color:"darkblue"},
      {id:"Total Emissions", isTotal: true}
      // {id:"Dedicated GHG Removal", color:"reddishorange"},
      // {id:"Electricity Generation", color:"yellow", pattern:"pattern-1"},
      // {id:"Hydrogen Production", color:"purple", pattern:"pattern-5"},
      // {id:"Other Energy Supply", color:"grey"},
      // {id:"Waste Management", color:"green", pattern:"pattern-0"},
      // {id:"Agriculture & Land Use", color:"green"},
      // {id:"Industry", color:"purple", pattern:"pattern-5"},
      // {id:"Buildings-Residential", color:"brown"},
      // {id:"Buildings-Non-Residential", color:"brown", pattern:"pattern-1"},
      // {id:"Transport-Domestic", color:"blue"},
      // {id:"Transport-International", color:"blue", pattern:"pattern-6"},
      // {id:"Total Emissions", isTotal: true}
    ]
  },
  PrimaryEnergyConsumption: {
    pathwayProperty: "energy_consumption",
    chart: {
      component: "StackedAreaChart",
      title: "Primary Energy Consumption",
      unit: "TWh/yr"
      // yMin: 0,
      // yMax: 4000
    },
    outputs: [
      {id:"Coal", color:"darkgrey"},
      {id:"Oil", color:"grey"},
      {id:"Natural gas", color:"lightgrey"},
      {id:"Waste", color:"darkbrown"},
      {id:"Bioenergy", color:"brown"},
      {id:"Hydrogen imports", color:"darkpurple"},
      {id:"Electricity imports", color:"mediumyellow"},
      {id:"Nuclear", color:"orange"},
      {id:"Environmental heat", color:"red"},
      {id:"Wind", color:"lightgreen"},
      {id:"Solar", color:"green"},
      {id:"Tidal, Wave, Hydro", color:"darkgreen"},
      {id:"Total", isTotal: true}
    ]
  },
  CumulativeGHGEmissions: {
    pathwayProperty: "emissions_cumulative",
    chart: {
      component: "LineChart",
      title: "Cumulative UK Greenhouse Gas Emissions",
      unit: "Mt.CO2e"
      // yMin: 0,
      // yMax: 50000
    },
    outputs: [
      {id:"Cumulative Emissions", dashStyle: "Solid", color:"black"}
      // {id:"Ref 1 (Name tbc)", dashStyle: "DashDot", color:"blue"},
      // {id:"Ref 2 (Name tbc)", dashStyle: "DashDot", color:"darkblue"}
    ]
  },
  FinalEnergyConsumption: {
    pathwayProperty: "final_energy_consumption",
    chart: {
      component: "StackedAreaChart",
      title: "Final Energy Consumption",
      unit: "TWh/yr"
      // yMin: 0,
      // yMax: 4000
    },
    outputs: [
      {id:"Dedicated GHG Removal", color:"red"},
      {id:"Agriculture", color:"green"},
      {id:"Industry", color:"darkgrey"},
      {id:"Buildings-Residential", color:"lightbrown"},
      {id:"Buildings-Non-Residential", color:"darkbrown"},
      {id:"Transport-Domestic", color:"lightblue"},
      {id:"Transport-International", color:"darkblue"},
      {id:"Total", isTotal: true}
    ]
  },
  //Transport
  EmissionsTransport: {
    pathwayProperty: "tra_emissions",
    chart: {
      component: "StackedAreaChart",
      title: "Emissions Transport",
      unit: "Mt.CO2e/yr"
      // yMin: -50,
      // yMax: 250
    },
    outputs: [
      {id:"Indirect emissions", color:"white"},
      {id:"Car", color:"yellow"},
      {id:"Bus", color:"orange"},
      {id:"Light Goods Vehicles", color:"lightbrown"},
      {id:"Heavy Goods Vehicles", color:"darkbrown"},
      {id:"Rail", color:"mediumred"},
      {id:"Shipping-Domestic", color:"lightgrey"},
      {id:"Aviation-Domestic", color:"grey"},
      {id:"Shipping-International", color:"lightblue"},
      {id:"Aviation-International", color:"darkblue"},
      {id:"Total Direct", isTotal: true}
    ]
  },
  EnergyConsumptionTransport: {
    pathwayProperty: "tra_energy",
    chart: {
      component: "StackedAreaChart",
      title: "Energy Consumption - Transport",
      unit: "TWh/yr"
      // yMin: 0,
      // yMax: 1000
    },
    outputs:[
      {id:"Electricity ", color:"yellow"},  // extra whitespace in name (API bug)
      {id:"Hydrogen ", color:"darkpurple"}, // extra whitespace in name (API bug)
      {id:"Biofuel", color:"brown"},
      {id:"Oil", color:"grey"},
      {id:"Total", isTotal: true}
    ]
  },
  PassengerDistanceTravelled: {
    pathwayProperty: "tra_pass",
    chart: {
      component: "StackedAreaChart",
      title: "Passenger Distance Travelled",
      unit: "Billion Passenger km/yr"
      // yMin: 0,
      // yMax: 1250
    },
    outputs:[
      {id:"Aviation-International", color:"darkblue"},
      {id:"Walking ", color:"lightgreen"},  // extra whitespace in name (API bug)
      {id:"Cycling", color:"darkgreen"},
      {id:"Rail", color:"mediumred"},
      {id:"Bus", color:"orange"},
      {id:"Car", color:"yellow"},
      {id:"Aviation-Domestic", color:"grey"},
      {id:"Total Domestic", isTotal: true}
    ]
  },
  RoadTransportEnergyConsumptionByEngineType: {
    pathwayProperty: "tra_energy_con",
    chart: {
      component: "StackedAreaChart",
      title: "Road Transport Energy Consumption by Engine Type",
      unit: "TWh/yr"
      // yMin: 0,
      // yMax: 600
    },
    outputs:[
      {id:"Hydrogen", color:"lightpurple"},
      {id:"Electric", color:"mediumyellow"},
      {id:"Plug-in Hybrid Electric", color:"darkbrown"},
      {id:"Internal Combustion Engine", color:"grey"},
      {id:"Total", isTotal: true}
    ]
  },
  //Buildings
  EmissionsBuildings: {
    pathwayProperty: "buildings_emissions",
    chart: {
      component: "StackedAreaChart",
      title: "Emissions - Buildings",
      unit: "Mt.CO2e/yr"
      // yMin: -50,
      // yMax: 250
    },
    outputs:[
      {id:"Indirect emissions", color:"white"},
      {id:"Residential", color:"lightbrown"},
      {id:"Non-residential", color:"darkbrown"},
      {id:"Total Direct", isTotal: true}
    ]
  },
  EnergyConsumptionBuildings: {
    pathwayProperty: "buildings_energy",
    chart: {
      component: "StackedAreaChart",
      title: "Energy Consumption - Buildings & Heat Networks",
      unit: "TWh/yr"
      // yMin: 0,
      // yMax: 1250
    },
    outputs:[
      {id:"Waste Heat", color:"red"},
      {id:"Electricity", color:"mediumyellow"},
      {id:"Hydrogen", color:"darkpurple"},
      {id:"Bioenergy", color:"brown"},
      {id:"Natural Gas", color:"lightgrey"},
      {id:"Oil", color:"grey"},
      {id:"Coal", color:"darkgrey"},
      {id:"Environmental Heat", color:"lightred"},
      {id:"Total", isTotal: true}
    ]
  },
  HeatSupplied: {
    pathwayProperty: "buildings_heat_supply",
    chart: {
      component: "StackedAreaChart",
      title: "Heat Supplied",
      unit: "TWh/yr"
      // yMin: 0,
      // yMax: 800
    },
    outputs:[
      {id:"District Heat Network ", color:"red"},
      {id:"Heat Pump", color:"orange"},
      {id:"Hybrid Heat Pump/Boiler ", color:"brown"},
      {id:"Electric Heater ", color:"mediumyellow"},
      {id:"Gas Boiler ", color:"lightgrey"},
      {id:"Oil/Solid Fuel Boiler", color:"darkgrey"},
      {id:"Total", isTotal: true}
    ]
  },
  HeatDemand: {
    pathwayProperty: "buildings_heat_demand",
    chart: {
      component: "StackedAreaChart",
      title: "Heat Demand",
      unit: "TWh/yr"
      // yMin: 0,
      // yMax: 800
    },
    outputs:[
      {id:"Residential Space Heat", color:"lightred"},
      {id:"Residential Hot Water", color:"darkred"},
      {id:"Non-Residential Space Heat", color:"lightbrown"},
      {id:"Non-Residential Hot Water", color:"darkbrown"},
      {id:"Total", isTotal: true},
    ]
  },
  //Industry
  EmissionsIndustry: {
    pathwayProperty: "ind_emissions",
    chart: {
      component: "StackedAreaChart",
      title: "Emissions - Industry",
      unit: "Mt.CO2e/yr"
      // yMin: -25,
      // yMax: 75
    },
    outputs:[
      {id:"Indirect emissions", color:"white"},
      {id:"Ferrous & non-ferrous metals", color:"blue"},
      {id:"Cement, Ceramics, Glass", color:"darkgreen"},
      {id:"Chemicals", color:"darkpurple"},
      {id:"Other Industry", color:"brown"},
      {id:"Total Direct", isTotal: true}
    ]
  },
  EnergyConsumptionIndustry: {
    pathwayProperty: "ind_energy_consumption",
    chart: {
      component: "StackedAreaChart",
      title: "Energy Consumption - Industry",
      unit: "TWh/yr"
      // yMin: 0,
      // yMax: 400
    },
    outputs:[
      {id:"Electricity", color:"mediumyellow"},
      {id:"Hydrogen", color:"darkpurple"},
      {id:"Bioenergy", color:"brown"},
      {id:"Natural gas", color:"lightgrey"},
      {id:"Oil", color:"grey"},
      {id:"Coal", color:"darkgrey"},
      {id:"Total", isTotal: true}
    ]
  },
  //CO2 Removal & Gases
  EmissionsRemoval: {
    pathwayProperty: "emissions_removal",
    chart: {
      component: "StackedAreaChart",
      title: "Emissions Removal",
      unit: "Mt.CO2e/yr",
      yMin: 0,
      yMax: 500
    },
    outputs:[
      {id:"Process CCS", color:"red"},
      {id:"Direct Air Capture (CCS)", color:"orange"},
      {id:"Enhanced Weathering", color:"blue"},
      {id:"Forestry", color:"darkgreen"},
      {id:"Total CO2 Removal", isTotal: true}
    ]
  },
  CumulativeEmissionsStored: {
    pathwayProperty: "emissions_stored",
    chart: {
      component: "LineChart",
      title: "Cumulative Emissions Stored",
      unit: "Mt.CO2e",
      yMin: 0,
      yMax: 40000
    },
    outputs:[
      {id:"Cumulative Storage", dashStyle: "Solid", color:"black"}
      // {id:"Ref 1 (tbc)", dashStyle: "DashDot", color:"lightblue"},
      // {id:"Ref 2 (tbc)", dashStyle: "DashDot", color:"blue"},
      // {id:"Ref 3 (tbc)", dashStyle: "DashDot", color:"darkblue"}
    ]
  },
  GasDistributionGridEnergySupplied: {
    pathwayProperty: "gas_grid",
    chart: {
      component: "StackedAreaChart",
      title: "Gas Distribution Grid Energy Supplied",
      unit: "TWh/yr",
      yMin: 0,
      yMax: 800
    },
    outputs:[
      {id:"Hydrogen", color:"darkpurple"},
      {id:"Biomethane", color:"brown"},
      {id:"Natural Gas", color:"lightgrey"},
      {id:"Total ", isTotal: true}
    ]
  },
  HydrogenSupply: {
    pathwayProperty: "hydrogen_production",
    chart: {
      component: "StackedAreaChart",
      title: "Hydrogen Supply",
      unit: "TWh/yr",
      yMin: 0,
      yMax: 1250
    },
    outputs:[
      {id:"Biomass CCS", color:"lightbrown"},
      {id:"Methane (SMR) CCS", color:"darkgrey"},
      {id:"Electrolysis", color:"mediumyellow"},
      {id:"Imports", color:"darkpurple"},
      {id:"Total", isTotal: true}
    ]
  },
  //Electricity
  EmissionsElectricityGeneration: {
    pathwayProperty: "electricity_emissions",
    chart: {
      component: "StackedAreaChart",
      title: "Emissions - Electricity Generation",
      unit: "Mt.CO2e/yr"
      // yMin: -200,
      // yMax: 300
    },
    outputs:[
      {id:"Biomass & Waste CCS", color:"lightbrown"},
      {id:"Biomass & Waste", color:"darkbrown"},
      {id:"Gas CCS", color:"lightgrey"},
      {id:"Gas", color:"grey"},
      {id:"Coal", color:"darkgrey"},
      {id:"Total", isTotal: true}
    ]
  },
  ElectricitySupply: {
    pathwayProperty: "electricity_generation",
    chart: {
      component: "StackedAreaChart",
      title: "Electricity Supply",
      unit: "TWh/yr"
      // yMin: 0,
      // yMax: 800
    },
    outputs:[
      {id:"Biomass & Waste CCS", color:"lightbrown"},
      {id:"Nuclear", color:"orange"},
      {id:"Wind", color:"green"},
      {id:"Solar", color:"red"},
      {id:"Tidal, Wave, Hydro", color:"blue"},
      {id:"Biomass & Waste", color:"darkbrown"},
      {id:"Gas CCS", color:"lightgrey"},
      {id:"Gas", color:"grey"},
      {id:"Coal", color:"darkgrey"},
      {id:"CHP", color:"lightpurple"},
      {id:"Net Imports", color:"yellow"},
      {id:"Total", isTotal: true}
    ]
  },
  ElectricalCapacity: {
    pathwayProperty: "electricity_capacity",
    chart: {
      component: "StackedAreaChart",
      title: "Electrical Capacity",
      unit: "GW"
      // yMin: 0,
      // yMax: 250
    },
    outputs:[
      {id:"Biomass & Waste CCS", color:"lightbrown"},
      {id:"Nuclear", color:"orange"},
      {id:"Wind", color:"green"},
      {id:"Solar", color:"red"},
      {id:"Tidal, Wave, Hydro", color:"blue"},
      {id:"Biomass & Waste", color:"darkbrown"},
      {id:"Gas CCS", color:"lightgrey"},
      {id:"Gas", color:"grey"},
      {id:"Coal", color:"darkgrey"},
      {id:"Interconnectors", color:"yellow"},
      {id:"Seasonal Storage", color:"darkpurple"},
      {id:"DSR & Batteries", color:"purple"},
      {id:"Total", isTotal: true}
    ]
  },
  PeakGatePowerDemand: {
    pathwayProperty: "electricity_peak",
    chart: {
      component: "StackedAreaChart",
      title: "Peak Gate Power Demand",
      unit: "GW"
      // yMin: 0,
      // yMax: 250
    },
    outputs:[
      {id:"Agriculture", color:"green"},
      {id:"Industry", color:"darkgrey"},
      {id:"Transport", color:"blue"},
      {id:"Buildings Other", color:"lightbrown"},
      {id:"Buildings Heat", color:"brown"},
      {id:"Energy Supply & GGR", color:"red"},
      {id:"Total", isTotal: true}
    ]
  },
  //Land Use & Bioenergy
  EmissionsLandUse: {
    pathwayProperty: "land_emissions",
    chart: {
      component: "StackedAreaChart",
      title: "Emissions - Land Use and Biofuels",
      unit: "Mt.CO2e/yr"
      // yMin: -100,
      // yMax: 100
    },
    outputs:[
      {id:"Indirect emissions", color:"white"},
      {id:"Forestry", color:"darkgreen"},
      {id:"Land", color:"lightgreen"},
      {id:"Agriculture & Livestock", color:"darkblue"},
      // {id:"Agricultural practices", color:"darkblue"},
      {id:"Bio-Conversion", color:"brown"},
      {id:"Waste Management", color:"darkbrown"},
      {id:"Total Direct", isTotal: true}
    ]
  },
  LandAreaTradeOff: {
    pathwayProperty: "land_trade_off",
    chart: {
      component: "StackedAreaChart",
      title: "Land Area Trade Off",
      unit: "km²"
      // yMin: 0,
      // yMax: 150000
    },
    outputs:[
      {id:"Forest", color:"darkgreen"},
      {id:"Bioenergy Land", color:"brown"},
      {id:"Remaining Available Land", color:"lightgrey"},
      {id:"Total Potential Land", isTotal: true}
    ]
  },
  DomesticBioenergyProduction: {
    pathwayProperty: "land_bioenergy",
    chart: {
      component: "StackedAreaChart",
      title: "Domestic Bioenergy Production",
      unit: "TWh/yr"
      // yMin: 0,
      // yMax: 500
    },
    outputs:[
      {id:"Solid Biomass", color:"darkbrown"},
      {id:"Dry Waste", color:"brown"},
      {id:"Wet Waste", color:"lightbrown"},
      {id:"Total", isTotal: true}
    ]
  },
  ImportedBioenergy: {
    pathwayProperty: "bioenergy_imports",
    chart: {
      component: "LineChart",
      title: "Imported Bioenergy",
      unit: "TWh/yr"
      // yMax: 900,
      // yMin: 0
    },
    outputs:[
      {id:"Total", dashStyle: "Solid", color:"black"}
      // {id:"Low Availability", dashStyle: "DashDot", color:"lighblue"},
      // {id:"Medium Availability", dashStyle: "DashDot", color:"blue"},
      // {id:"High Availability", dashStyle: "DashDot", color:"darkblue"}
    ]
  },
  //Imports, Map & Flows
  EnergyImports: {
    pathwayProperty: "security_import_energy",
    chart: {
      component: "StackedAreaChart",
      title: "Energy Imports",
      unit: "TWh/yr"
      // yMin: 0,
      // yMax: 4000
    },
    outputs:[
      {id:"Coal", color:"darkgrey"},
      {id:"Oil", color:"grey"},
      {id:"Gas ", color:"lightgrey"},
      {id:"Bioenergy", color:"brown"},
      {id:"Electricity ", color:"mediumyellow"},
      {id:"Hydrogen", color:"darkpurple"},
      {id:"Nuclear (Uranium)", color:"orange"},
      {id:"Total", isTotal: true}
    ]
  },
  EnergyImportDependence: {
    pathwayProperty: "security_import_fraction",
    chart: {
      component: "PercentageChart",
      title: "Energy Import Dependence",
      unit: "Percent",
      yMin: 0,
      yMax: 100
    },
    outputs:[
      {id:"Coal ", dashStyle: "Solid", color:"darkgrey"},
      {id:"Oil", dashStyle: "Solid", color:"grey"},
      {id:"Gas ", dashStyle: "Solid", color:"lightgrey"},
      {id:"Bioenergy", dashStyle: "Solid", color:"brown"},
      {id:"Overall", dashStyle: "DashDot", color:"black"}
    ]
  }

};
