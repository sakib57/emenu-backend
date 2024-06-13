export enum CategoryType {
  BUSINESS = 'BUSINESS',
  SERVICE = 'SERVICE',
}

export enum Currency {
  USD = 'USD',
  CAD = 'CAD',
  TK = 'TK',
  EURO = 'EURO',
  INR = 'INR',
  AUD = 'AUD',
}

export enum Continent {
  ASIA = 'Asia',
  AFRICA = 'Africa',
  ANTARCTICA = 'Antarctica',
  EUROPE = 'Europe',
  NORTH_AMERICA = 'North America',
  SOUTH_AMERICA = 'South America',
  OCEANIA = 'Oceania',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHERS = 'Others',
}

export enum Language {
  ENGLISH = 'ENGLISH',
  SPANISH = 'SPANISH',
  FRENCH = 'FRENCH',
  CATALAN = 'CATALAN',
  GERMAN = 'GERMAN',
}

export enum MediaType {
  DOC = 'DOC',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export enum MediaProvider {
  AWS_S3 = 'AWS_S3',
  LOCAL = 'LOCAL',
  DO_SPACE = 'DO_SPACE',
  GOOGLE_CLOUDE = 'GOOGLE_CLOUDE',
}

export enum MobilePrefixes {
  Bangladesh = '+88',
  Canada = '+1',
  USA = '+1',
  UAE = '+971',
}

export enum SocialMedia {
  FACEBOOK = 'facebook',
  TWITTER = 'Twitter',
  INSTAGRAM = 'instagram',
  SNAPCHAT = 'snapchat',
  YOUTUBE = 'Youtube',
}

export enum Status {
  REQUESTED = 'REQUESTED',
  INVITED = 'INVITED',
  JOINED = 'JOINED',
  DENIED = 'DENIED',
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  CANCELED = 'CANCELED',
  RESCHEDULED = 'RESCHEDULED',
  COMPLETED = 'COMPLETED',
}

export enum ScheduleStatus {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  ALLOCATED = 'ALLOCATED',
}

export enum EventStatus {
  CLOSED = 'CLOSED',
}

export enum VoucherType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export enum RoleType {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  WAITER = 'WAITER',
  BRANCH_MANAGER = 'BRANCH_MANAGER'
}

export enum OrderType {
  IN_HOUSE = 'IN_HOUSE',
  PARCEL = 'PARCEL',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRM = 'CONFIRM'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  DECLINE = 'DECLINE',
}

export enum PrinterType {
  STAR = 'STAR',
  EPSON = 'EPSON',
}
