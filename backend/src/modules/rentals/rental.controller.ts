import { Request, Response } from 'express';
import { rentBookSchema } from './rental.schema';
import { rentalService } from './rental.service';

export async function rentBook(req: Request, res: Response): Promise<void> {
  const input = rentBookSchema.parse(req.body);
  const rental = await rentalService.rent(input);
  req.log?.info(
    { event: 'rental.rent', rentalId: rental.id, userId: input.userId, bookId: input.bookId },
    'book rented',
  );
  res.status(201).json(rental);
}

export async function returnRental(req: Request, res: Response): Promise<void> {
  const rental = await rentalService.return(req.params.id);
  req.log?.info({ event: 'rental.return', rentalId: rental.id }, 'book returned');
  res.json(rental);
}

export async function listUserRentals(req: Request, res: Response): Promise<void> {
  const rentals = await rentalService.listByUser(req.params.id);
  res.json(rentals);
}
