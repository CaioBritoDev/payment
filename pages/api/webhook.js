async function handle(request, response) {
  const data = request.query;

  const type = data["type"];
  const id = data["data.id"];

  if (type === "payment") {

    const payment = await getPayment(id);
    console.log(payment);

    const data = {
      _id: payment.metadata._id,
      payment_status: payment.status,
    };

    console.log(data);

    // updateDatabase(data);
  }

  response.status(200)

}

export default handle;

function getPayment(id) {
  const { MercadoPago, Payment } = require("mercadopago");

  const client = new MercadoPago({ accessToken: process.env.ACCESS_TOKEN_TEST });
  const payment = new Payment(client);

  return payment
    .get({
      id: id,
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
        return err;
    });
}

async function updateDatabase(data) {
  const pool = require("./lib/database");
  const { _id, payment_status } = data;
  const update = await pool
    .query("UPDATE management SET payment_status = $2 WHERE _id = $1", [
      _id,
      payment_status,
    ])
    .catch((err) => console.error(err));
  console.log(update);
}
