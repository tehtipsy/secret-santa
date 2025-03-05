export interface Participant {
  id: string;
  name: string;
  email?: string;
  exclusions?: string[];
}

export interface Pairing {
  giver: Participant;
  receiver: Participant;
}
