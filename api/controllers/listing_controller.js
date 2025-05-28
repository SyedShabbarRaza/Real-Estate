import express from "express";
import Listing from "../models/listing_model.js";
import { errorHandler } from "../utils/error.js";
export const createListing = async (req, res, next) => {
  try {
    console.log("create listing mein");

    const {
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls,
      userRef,
    } = req.body;

    console.log("listing mein");
    const listing = await Listing.create({
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls,
      userRef,
    });

    console.log("listing", listing);
    return res.status(201).json(listing);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete you own listings"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {

    console.log(req.params.id);
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
        return next(errorHandler(404, "Listing not found"));
    }
    
    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, "You can only update your own listings"));
    }
    
    try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
} catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
    try {
        const listing= await Listing.findById(req.params.id);
        if (!listing) {
          return next(errorHandler(404, "Listing not found"));
        }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
    try {
        const limit=parseInt(req.query.limit)||9;
        const startIndex=parseInt(req.query.startIndex)||0;
        let offer=req.query.offer;

        if(offer===undefined || offer==='false'){
          offer={$in:[false,true]}
        }
        let furnished=req.query.furnished;

        if(furnished===undefined||furnished==='false'){
          furnished={$in:[false,true]}
        }
        
        let parking=req.query.parking;
        if(parking===undefined||parking==='false'){
          parking={$in:[false,true]}
        }

        let type=req.query.type;
        if(type===undefined||type==='false'){
          type={$in:[false,true]}
        }

        const searchTerm=req.query.searchTerm||'';

        const sort=req.query.sort||'createdAt';
        
        const order=req.query.order||'desc';

        const listings=await Listing.find({
          name:{$regex:searchTerm,$options:'i'}, //i===compare with each word and it's parts
          offer,
          furnished,
          parking,
          type,
        }).sort({[sort]:order}).limit(limit).skip(startIndex);

        return res.status(200).json(listings);

  } catch (error) {
    next(error);
  }
};
