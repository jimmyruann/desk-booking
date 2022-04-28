import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  Min,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
class IsLessThan implements ValidatorConstraintInterface {
  validate(propertyValue: number, args: ValidationArguments) {
    return propertyValue < args.object[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" must be less than "${args.constraints[0]}"`;
  }
}

export class BookingsTime {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @Min(1)
  @Validate(IsLessThan, ['endTime'])
  readonly startTime: number;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @Min(1)
  readonly endTime: number;
}

export class CreateBookingDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly htmlId: string;

  @ApiProperty({
    type: () => [BookingsTime],
  })
  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => BookingsTime)
  readonly bookings: BookingsTime[];
}
