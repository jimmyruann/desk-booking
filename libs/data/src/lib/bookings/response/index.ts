import { AreaEntity } from '../../areas';
import { LocationEntity } from '../../locations';
import { UserEntity } from '../../users';
import { BookingEntity } from '../entities/bookings.entity';

export interface BookingResponse extends BookingEntity {
  User: Pick<UserEntity, 'firstName' | 'lastName' | 'email'>;
  Area: AreaEntity & {
    Location: LocationEntity;
  };
}

export interface FindAllBookingsResponse {
  count: number;
  data: BookingResponse[];
}

export type FindOneBookingResponse = BookingResponse;
