module.exports = {
  dialect: "postgres",
  host: "localhost",
  //port: '5432',
  username: "postgres",
  password: "docker",
  database: "gobarder",
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
