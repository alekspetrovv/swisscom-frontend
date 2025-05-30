export interface Owner {
  id: string;
  name: string;
  accountNumber: string;
  level: number;
}

export interface ResourceSummary {
  id: string;
  name: string;
  owners: Owner[];
}
