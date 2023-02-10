export class Greeting {
  _id: string;
  prompt: string;
  generatedText: string;
}

export class UpdateCustomerDto {
  userId: string;
  greeting: Greeting;
}
