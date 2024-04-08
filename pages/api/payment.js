import { Payment, MercadoPagoConfig } from "mercadopago";

export default async function payment(request, response) {
  const authKey = process.env.AUTH_KEY;

  const bearer = request.headers["authorization"];

  if (!request.body) {
    return response.status(400).json({ message: "no body in request" });
  }

  if (!bearer) {
    return response.status(401).json({
      message:
        "authorization failed in endpoint stage - header without authorization",
    });
  }

  const endpointKey = bearer.replace("Bearer", "").trim();

  if (endpointKey !== authKey) {
    return response.status(401).json({
      message: "authorization failed in endpoint stage - invalid endpoint key",
    });
  }

  const amount = request.body.amount;
  const payer = request.body.payer;
  const month = new Date().getMonth() + 1;

  if (!amount) {
    return response.status(499).json({
      message: "no amount informed",
    });
  }

  if (!payer) {
    return response.status(499).json({
      message: "no payer info informed",
    });
  }

  const data = {
    amount: amount,
    payer: payer,
    month: month,
  };

  await callMercadoPago(data).then((res) => {

    if (res) {

      response.status(200).json({
        link: res.point_of_interaction.transaction_data.ticket_url
      })

    } else {

      response.status(499).json({
        msg: "Algo deu errado, tente novamente!"
      })

    }

  });
}

async function callMercadoPago(data) {
  const { v4: uuidv4 } = require("uuid");
  const uuid = uuidv4();

  const client = new MercadoPagoConfig({
    accessToken: process.env.ACCESS_TOKEN,
  });
  const payment = new Payment(client);

  const nextMonth = data.month + 1;
  const year = new Date().getFullYear();

  try {
    return payment
      .create({
        body: {
          transaction_amount: data.amount,
          date_of_expiration: new Date(year, nextMonth, 0).toISOString(),
          description: `Valor de uso do sistema referente ao mês ${data.month}`,
          payment_method_id: "pix",
          payer: {
            email: data.payer.email,
            identification: {
              type: data.payer.identificationType,
              number: data.payer.number,
            },
          },
          metadata: {
            payer: data.payer.name,
            month: data.month,
            _id: uuid,
          },
        },
        requestOptions: { idempotencyKey: uuid },
      })
      .then((result) => {
        return result;
      });
  } catch (error) {
    console.error("Failed payment " + error);
    return false;
  }
}
