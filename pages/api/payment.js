export default function payment(request, response) {

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

  const monthPayments = request.body.payments;

  


}
