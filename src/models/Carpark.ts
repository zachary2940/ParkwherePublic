export interface Carpark {
   CarparkID: string; //key
   CarparkName: string
   AvailableLots: number
   Location: string
   Agency: string
   vehCat: string
   WeekDays_Rate_1: string
   WeekDays_Rate_2: string
   Saturday_Rate: string
   Sunday_PublicHoliday_Rate: string
   Free?: string
}

export const CarparkKeys =
   ['CarparkID',
      'CarparkName',
      'AvailableLots',
      'Location',
      'Agency',
      'vehCat',
      'WeekDays_Rate_1',
      'WeekDays_Rate_2',
      'Saturday_Rate',
      'Sunday_PublicHoliday_Rate']

// what i want the users to input, 
//  structured rates then later parsed to be Carpark Model
// export interface CarparkInput {
//    CarparkID: string; //key
//    CarparkName: string
//    Location: string
//    Agency: string
//    vehCat: string
//    weekdayMin: string
//    weekdayRate: string
//    satdayMin: string
//    satdayRate: string
//    sunPHMin: string
//    sunPHRate: string
//    startTime: string
//    endTime: string
//    // parkCapacity: string
// }

export interface CarparkRatesLTA {
   CarPark: string; //key
   Address: string
   Location: string
   Category?: string //motorcycle does not have
   WeekDays_Rate_1: string
   WeekDays_Rate_2: string
   Saturday_Rate: string
   Sunday_PublicHoliday_Rate: string
}

export interface CarparkAvailabilityLTA {
   Location: string
   Area: string
   Development: string //key
   LotType: string
   Agency: string
   AvailableLots: string
}


// multiple same keys but with different rates and time
export interface CarparkRatesURA {
   ppCode: string //key
   ppName: string
   geometries: CarparkCoordinatesURA[]
   parkingSystem: string
   vehCat: string
   weekdayMin: string
   weekdayRate: string
   satdayMin: string
   satdayRate: string
   sunPHMin: string
   sunPHRate: string
   startTime: string
   endTime: string
   parkCapacity: string
}

export interface CarparkAvailabilityURA {
   carparkNo: string; //key
   geometries: CarparkCoordinatesURA[]
   lotsAvailable: string
   lotType: string
}

interface CarparkCoordinatesURA {
   coordinates: string
}


