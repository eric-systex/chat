db.createUser(
{
    user: "chat",
    pwd: "chat",
    roles: [ { role: "readWrite", db: "chat" } ]
}
)
