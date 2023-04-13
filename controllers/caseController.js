const Case = require("../models/caseModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const axios = require("axios");

exports.createCase = factory.createOne(Case);
exports.getAllCases = factory.getAll(Case);
exports.getOneCase = factory.getOne(Case);
exports.updateOneCase = factory.updateOne(Case);
exports.deleteOneCase = factory.deleteOne(Case);

exports.handleNumberPlate = catchAsync(async (req, res, next) => {
  console.log(req.params);
  let receivedTime = new Date().toISOString().split("T")[1];
  let receivedDate = new Date().toISOString();
  let recievedVehicleNumber = req.params.vehicleNumber;
  let cameraLocation = req.params.city;

  let fetchedData;
  let url = `${process.env.TRAFFIC_API}/vehicles`;

  await axios(url, {
    method: "GET",
    params: {
      vehicleNumber: recievedVehicleNumber,
    },
  }).then((data) => {
    // console.log(data.data.doc.length);
    // console.log(data.results != 0);
    if (data.data.doc.length > 0) {
      fetchedData = data.data;
      delete fetchedData.doc[0]._id;
      delete fetchedData.doc[0].id;
    }
    // fetchedData.doc[0]._id = undefined;
    // fetchedData.doc[0].id = undefined;
  });
  let data =
    fetchedData && fetchedData.doc.length > 0
      ? {
          receivedTime,
          receivedDate,
          recievedVehicleNumber,
          cameraLocation,
          ...fetchedData.doc[0],
        }
      : {
          receivedTime,
          receivedDate,
          recievedVehicleNumber,
          cameraLocation,
          unregisterd: true,
        };

  const doc = await Case.create(data);
  if (!doc) {
    next(new AppError("There was a error getting data from api..", 400));
  }
  res.status(200).json({
    status: "success",
    doc,
  });
  //   const doc = await Case.create();
});

exports.searchCases = catchAsync(async (req, res, next) => {
  const { search } = req.query;
  let date = new Date();
  //   console.log(date.setHours(0, 0, 0));
  //   console.log(date.setDate(date.getDate() + 1));
  // console.log(date.setHours(0, 0, 0, 0));
  // console.log(date.toISOString());
  let date2 = new Date();
  // console.log(date2.setHours(0, 0, 0, 0));
  date2 = date2.setDate(date.getDate() + 1);
  // console.log(typeof date, typeof date2);
  date = date.toISOString();
  // console.log(new Date(date2).toISOString());
  date2 = new Date(date2).toISOString();

  //   console.log(req.query);
  if (search.length != 0) {
    await Case.find({
      arrived: true,
      // appointmentDate: [gte]date,
      // "appointmentDate[lte]": date2,
      $or: [
        //   name: { $regex: search, $options: "i" },
        { currentOwner: { $regex: search, $options: "i" } },
        { vehicleNumber: { $regex: search, $options: "i" } },
        // { arrived: { $regex: true, $options: "i" } },
        // { _id: { $regex: search, $options: "i" } },
        //   _id: { $regex: search, $options: "i" },
        // { active: { $regex: search, $options: "i" } },
        // { patients: { $regex: search, $options: "i" } },
        // { hospitals: { $regex: search, $options: "i" } },
        // { appointmentDate: { $regex: search, $options: "i" } },
      ],
    })
      .then((data) => {
        res.status(200).json({
          status: "success",
          message: `${data.length} found...`,
          data,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          satus: "failed",
          message: err,
        });
      });
  }
});
exports.searchCityCases = catchAsync(async (req, res, next) => {
  const { search, city } = req.query;
  // console.log(typeof id, typeof search);
  if (search.length != 0) {
    await Case.find({
      $and: [
        //   name: { $regex: search, $options: "i" },
        { currentOwner: { $regex: search, $options: "i" } },
        { currentOwnerCity: { $regex: city, $options: "i" } },
        //   _id: { $regex: search, $options: "i" },
        // { active: { $regex: search, $options: "i" } },
        // { patients: { $regex: search, $options: "i" } },
        // { hospitals: { $regex: search, $options: "i" } },
        // { appointmentDate: { $regex: search, $options: "i" } },
      ],
    })
      .then((data) => {
        res.status(200).json({
          status: "success",
          message: `${data.length} found...`,
          data,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          satus: "failed",
          message: err,
        });
      });
  }
});

exports.getCasesCountByDate = catchAsync(async (req, res, next) => {
  stats = await Case.aggregate([
    { $group: { _id: "$recievedDate", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    status: "success",
    message: "done..",
    stats,
  });
});
exports.getCasesCountByTime = catchAsync(async (req, res, next) => {
  stats = await Case.aggregate([
    { $group: { _id: "$recievedTime", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    status: "success",
    message: "done..",
    stats,
  });
});
exports.getCasesCountByVehicleNumber = catchAsync(async (req, res, next) => {
  stats = await Case.aggregate([
    { $group: { _id: "$vehicleNumber", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    status: "success",
    message: "done..",
    stats,
  });
});
exports.getCasesCountByCity = catchAsync(async (req, res, next) => {
  stats = await Case.aggregate([
    { $group: { _id: "$currentOwnerCity", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    status: "success",
    message: "done..",
    stats,
  });
});
exports.getCasesActiveCount = catchAsync(async (req, res, next) => {
  stats = await Case.aggregate([
    { $group: { _id: "$active", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    status: "success",
    message: "done..",
    stats,
  });
});
exports.getCasesActiveCount = catchAsync(async (req, res, next) => {
  stats = await Case.aggregate([
    { $group: { _id: "$active", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    status: "success",
    message: "done..",
    stats,
  });
});


