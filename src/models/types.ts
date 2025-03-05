export interface Participant {
  id: string;
  name: string;
  exclusions?: string[]; // IDs of participants that this person cannot be paired with
}

export interface Pairing {
  giver: Participant;
  receiver: Participant;
}
