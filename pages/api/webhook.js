export default function handle(request, response) {
    
    const data = request.query

    const type = dados["type"] || dados["topic"]
    const id = dados["data.id"] || dados["id"]

    console.log(type, id)

    response.status(200)
}