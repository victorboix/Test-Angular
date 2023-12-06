export interface Nature {
  type: string;
  lib: string;
}

export interface NatureTrip extends Nature {
  distance: number;
}

export interface NatureRestaurant extends Nature {
  invites: number;
}

export class NatureTrip implements NatureTrip {
  constructor(distance: number) {
    this.type = "trip";
    this.lib = "Déplacement";
    this.distance = distance;
  }
}

export class NatureRestaurant implements NatureRestaurant {
  constructor(invites: number) {
    this.type = "restaurant";
    this.lib = "Restaurant";
    this.invites = invites;
  }
}
