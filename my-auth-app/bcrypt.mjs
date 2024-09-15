import bcrypt from 'bcrypt';

const pass = 'testtest';

const main = async () => {
  const hash = await bcrypt.hash(pass, 10);
  console.log(hash);
  console.log(await bcrypt.compare(pass, hash));
  console.log(await bcrypt.compare(pass, "$2b$10$bFRjcByNZzGLoSe7bklQQ.nbMG.ZFQviep9X3mfeg3UmvHP0KX6ki"));
  console.log(await bcrypt.compare(pass, "$2b$10$/puDs8nUhGvcM8E4q8J5Z.Cp02mvvY1tB1E8e1zp/W7BIUfcfN.9C"));
  console.log(await bcrypt.compare(pass, "$2b$10$OncsYW3UrLfDQ1JmyFDC9OUzdQJ/L9xAC3BworzGDUGS9whBHvPom"));
  console.log(await bcrypt.compare(pass, "$2b$10$VGdKWjs0sH3kGRAQei8PiuUvcPNclTTvToLkk8qFpJzaQKsCPTX0W"));
  console.log(await bcrypt.compare(pass, "$2b$10$VGdKWjs0sH3kGRAQei8PiuUvcPNclTTvToLkk8qFpJzaQKsCPTX0D"));
};

main();

