const publicUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    phone: user.phone,
});

module.exports = publicUser;
