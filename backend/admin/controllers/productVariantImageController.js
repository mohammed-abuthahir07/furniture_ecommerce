const productVariantModel = require("../models/productVariantModel");
const productVariantImageModel = require("../models/productVariantImageModel");

const cleanupUploads = (files = []) => {
  productVariantImageModel.removeImageFiles(
    files.map((file) => `/uploads/products/${file.filename}`)
  );
};

const createVariantImages = async (req, res) => {
  const files = Array.isArray(req.files) ? req.files : [];
  try {
    const variantId = Number(req.body.variant_id);
    const imageTitle = String(req.body.image_title || "").trim();

    if (!Number.isInteger(variantId) || variantId <= 0) {
      cleanupUploads(files);
      return res.status(400).json({
        success: false,
        message: "A valid finish is required.",
      });
    }

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Choose at least one photo to upload.",
      });
    }

    const variant = await productVariantModel.getVariantById(variantId);
    if (!variant) {
      cleanupUploads(files);
      return res.status(404).json({
        success: false,
        message: "That finish could not be found.",
      });
    }

    const existing = await productVariantImageModel.getImagesByVariantId(variantId);
    if (existing.length + files.length > productVariantImageModel.MAX_IMAGES_PER_VARIANT) {
      cleanupUploads(files);
      return res.status(400).json({
        success: false,
        message: `A finish can have up to ${productVariantImageModel.MAX_IMAGES_PER_VARIANT} photos.`,
      });
    }

    await productVariantImageModel.createVariantImages(
      variantId,
      files,
      imageTitle
    );

    const images = await productVariantImageModel.getImagesByVariantId(variantId);
    return res.status(201).json({
      success: true,
      message: "Finish photos uploaded.",
      images,
    });
  } catch (error) {
    cleanupUploads(files);
    console.error("Create variant images error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Unable to save these finish photos. Please try again.",
    });
  }
};

const getImagesByVariantId = async (req, res) => {
  try {
    const variantId = Number(req.params.variantId);
    if (!Number.isInteger(variantId) || variantId <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid finish is required.",
      });
    }

    const variant = await productVariantModel.getVariantById(variantId);
    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "That finish could not be found.",
      });
    }

    const images = await productVariantImageModel.getImagesByVariantId(variantId);
    return res.status(200).json({
      success: true,
      variant: {
        id: variant.id,
        product_id: variant.product_id,
        variant_name: variant.variant_name,
        color: variant.color,
      },
      images,
    });
  } catch (error) {
    console.error("Get variant images error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load finish photos. Please try again.",
    });
  }
};

const updateVariantImage = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await productVariantImageModel.getVariantImageById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "That photo could not be found.",
      });
    }

    const sortOrder = req.body.sort_order;
    if (
      sortOrder !== undefined &&
      sortOrder !== null &&
      sortOrder !== "" &&
      (!Number.isInteger(Number(sortOrder)) || Number(sortOrder) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Display order must be a whole number.",
      });
    }

    const imageTitle = req.body.image_title !== undefined
      ? String(req.body.image_title).trim().slice(0, 150)
      : existing.image_title;

    await productVariantImageModel.updateVariantImage(id, {
      image_title: imageTitle,
      sort_order: sortOrder !== undefined && sortOrder !== ""
        ? Number(sortOrder)
        : existing.sort_order,
    });

    const image = await productVariantImageModel.getVariantImageById(id);
    return res.status(200).json({
      success: true,
      message: "Finish photo updated.",
      image,
    });
  } catch (error) {
    console.error("Update variant image error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update this photo. Please try again.",
    });
  }
};

const reorderVariantImages = async (req, res) => {
  try {
    const variantId = Number(req.body.variant_id);
    const orderedIds = Array.isArray(req.body.ordered_ids)
      ? req.body.ordered_ids.map(Number)
      : [];

    if (!Number.isInteger(variantId) || variantId <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid finish is required.",
      });
    }

    if (orderedIds.some((imageId) => !Number.isInteger(imageId) || imageId <= 0)) {
      return res.status(400).json({
        success: false,
        message: "The photo order is not valid.",
      });
    }

    const existing = await productVariantImageModel.getImagesByVariantId(variantId);
    const existingIds = existing.map((image) => image.id).sort((a, b) => a - b);
    const incomingIds = [...orderedIds].sort((a, b) => a - b);
    const sameSet = existingIds.length === incomingIds.length
      && existingIds.every((imageId, index) => imageId === incomingIds[index]);

    if (!sameSet) {
      return res.status(400).json({
        success: false,
        message: "The photo order does not match this finish.",
      });
    }

    await productVariantImageModel.reorderVariantImages(variantId, orderedIds);
    const images = await productVariantImageModel.getImagesByVariantId(variantId);
    return res.status(200).json({
      success: true,
      message: "Photo order updated.",
      images,
    });
  } catch (error) {
    console.error("Reorder variant images error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Unable to reorder these photos. Please try again.",
    });
  }
};

const deleteVariantImage = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await productVariantImageModel.getVariantImageById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "That photo could not be found.",
      });
    }

    await productVariantImageModel.deleteVariantImage(id);
    productVariantImageModel.removeImageFiles([existing.image]);

    return res.status(200).json({
      success: true,
      message: "Finish photo deleted.",
    });
  } catch (error) {
    console.error("Delete variant image error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete this photo. Please try again.",
    });
  }
};

module.exports = {
  createVariantImages,
  getImagesByVariantId,
  updateVariantImage,
  reorderVariantImages,
  deleteVariantImage,
};
