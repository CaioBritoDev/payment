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

  response.status(200);
}

export default handle;

function getPayment(id) {
  const axios = require("axios");

  const url = "https://api.mercadopago.com/v1/payments/" + id;

  try {
    return axios
      .get(url, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN_TEST}`,
      })
      .then((res) => {
        console.log(res)
        return res;
      });
  } catch (error) {
    console.log(error)
    return error;
  }
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
