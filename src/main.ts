import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function start() {
  try {
    const PORT = process.env.PORT ?? 3003;
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      })
    );
    app.setGlobalPrefix("api");

    await app.listen(PORT, () => {
      console.log(`Server has started working at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
start();
