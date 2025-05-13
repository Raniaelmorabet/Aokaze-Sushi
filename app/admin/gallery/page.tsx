"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Trash2,
  Plus,
  X,
  Loader2,
  ImageIcon,
  CheckCircle,
  Star,
  StarOff,
  ChevronLeft,
  ChevronRight,
  MoveVertical,
  Check,
} from "lucide-react";
import Image from "next/image";
import { API_BASE_URL, galleryAPI } from "@/utils/api";


export default function GalleryManagement() {
  const [getGallery, setGetGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [positionModalOpen, setPositionModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTab, setSelectedTab] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [positionSelection, setPositionSelection] = useState({
    first: null,
    second: null,
    third: null,
  });
  const [selectingPosition, setSelectingPosition] = useState(null);

const filteredGallery = getGallery
  .filter((image) => {
    // Handle tab-based filtering (unchanged)
    switch (selectedTab) {
      case "all":
        return true;
      case "featured":
        return image.isFeatured === true;
      case "positioned":
        return image.position !== null && image.position !== undefined;
      default:
        return true;
    }
  })
  .sort((a, b) => {
    // Handle position sorting with adjusted values
    const aPos = a.position !== null && a.position !== undefined ? (a.position === 0 ? 1 : a.position) : null;
    const bPos = b.position !== null && b.position !== undefined ? (b.position === 0 ? 1 : b.position) : null;

    if (aPos !== null && bPos !== null) {
      return aPos - bPos;
    }
    if (aPos !== null) return -1;
    if (bPos !== null) return 1;
    // Fallback to upload date (newest first)
    return new Date(b.uploadedAt) - new Date(a.uploadedAt);
  });

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      // Handle the image
      if (imageFile) {
        if (imageFile instanceof File) {
          formData.append("image", imageFile);
        } else if (
          typeof imageFile === "string" &&
          imageFile.startsWith("data:")
        ) {
          // Convert base64 to blob
          const response = await fetch(imageFile);
          const blob = await response.blob();
          formData.append("image", blob, "gallery-image.jpg");
        } else if (typeof imageFile === "string") {
          formData.append("imageUrl", imageFile);
        }
      }
      setTimeout(() => {
        setUploadProgress(25);
      }, 500);

      setTimeout(() => {
        setUploadProgress(50);
      }, 500);

      const responce = await galleryAPI.uploadGalleryImages(formData);

      console.log(responce.data.images[0]);
      setGetGallery((prev) => [...prev, responce.data.images[0]]);
      if (responce.success) {
        setImageFile(null);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadProgress(100);
      }, 500);
    }

    // Reset form after successful upload
    setTimeout(() => {
      setUploadModalOpen(false);
      setImageFile(null);
      setImagePreview(null);
      setUploadSuccess(false);
      setUploading(false);
    }, 1500);
  };

  // Toggle featured status
  const toggleFeatured = async (image) => {
    const updatedGallery = getGallery.map((img) =>
      img._id === image._id ? { ...img, isFeatured: !img.isFeatured } : img
    );

    const responce = await galleryAPI.toggleFeaturedStatus(image.publicId);
    if (responce.success) {
      setGetGallery(updatedGallery);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (image) => {
    setSelectedImage(image);
    setDeleteModalOpen(true);
  };

  // Open preview modal
  const openPreviewModal = (image) => {
    setSelectedImage(image);
    setPreviewModalOpen(true);
  };

  // Get position label
  const getPositionLabel = (imageId) => {
    if (positionSelection.first === imageId) return "1st";
    if (positionSelection.second === imageId) return "2nd";
    if (positionSelection.third === imageId) return "3rd";
    return null;
  };

  // Add this function to handle position selection
  const handlePositionSelect = async (imageId, position) => {
    if (position === "first") {
      setPositionSelection({ ...positionSelection, first: imageId });
      const responce = await galleryAPI.updateImagePosition(imageId, 1);
      console.log(responce);
    } else if (position === "second") {
      setPositionSelection({ ...positionSelection, second: imageId });
      const responce = await galleryAPI.updateImagePosition(imageId, 2);
      console.log(responce);
    } else if (position === "third") {
      setPositionSelection({ ...positionSelection, third: imageId });
      const responce = await galleryAPI.updateImagePosition(imageId, 3);
      console.log(responce);
    }
    setSelectingPosition(null);
  };

  const Gallery = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/gallery?limit=100`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      setGetGallery(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteImage = async () => {
    try {
      console.log(selectedImage.publicId);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/gallery/${selectedImage.publicId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDeleteModalOpen(false);
      setGetGallery(
        getGallery.filter((image) => image.publicId !== selectedImage.publicId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Initialize position selection from gallery data
  useEffect(() => {
    const positions = {
      first: getGallery.find((img) => img.position === 1)?.publicId || null,
      second: getGallery.find((img) => img.position === 2)?.publicId || null,
      third: getGallery.find((img) => img.position === 3)?.publicId || null,
    };
    setPositionSelection(positions);
  }, [getGallery]);

  useEffect(() => {
    Gallery();
  }, []);



  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Gallery Management</h1>
          <p className="text-gray-400">
            Upload, manage, and arrange your gallery images
          </p>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={() => setPositionModalOpen(true)}
          >
            <MoveVertical size={18} />
            <span>Arrange</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={() => setUploadModalOpen(true)}
          >
            <Plus size={18} />
            <span>Add Image</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex mb-6 border-b border-gray-800"
      >
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors relative ${
            selectedTab === "all"
              ? "text-white"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setSelectedTab("all")}
        >
          All Images
          {selectedTab === "all" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
              initial={false}
            />
          )}
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors relative ${
            selectedTab === "featured"
              ? "text-white"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setSelectedTab("featured")}
        >
          Featured
          {selectedTab === "featured" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
              initial={false}
            />
          )}
        </button>
        {/* <button
          className={`px-4 py-2 font-medium text-sm transition-colors relative ${
            selectedTab === "positioned"
              ? "text-white"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setSelectedTab("positioned")}
        >
          Positioned
          {selectedTab === "positioned" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
              initial={false}
            />
          )}
        </button> */}
      </motion.div>

      {/* gallery Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >
        <div className="bg-[#1E1E1E] rounded-xl p-4 flex items-center">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 mr-4">
            <ImageIcon size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Images</p>
            <p className="text-2xl font-bold">{getGallery.length}</p>
          </div>
        </div>

        <div className="bg-[#1E1E1E] rounded-xl p-4 flex items-center">
          <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 mr-4">
            <Star size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Featured Images</p>
            <p className="text-2xl font-bold">
              {getGallery.filter((img) => img.isFeatured).length}
            </p>
          </div>
        </div>
      </motion.div>

      {/* gallery Grid */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
          <p className="text-gray-400">Loading gnollery images...</p>
        </div>
      ) : filteredGallery.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredGallery.map((image, index) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
                className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-md group relative"
              >
                <div className="relative aspect-square">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt="Gallery image"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {image.isFeatured && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}

                  {getPositionLabel(image.publicId) && (
                    <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                      {getPositionLabel(image.publicId)}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => openPreviewModal(image)}
                        className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                      >
                        <ImageIcon size={16} />
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleFeatured(image)}
                          className={`${
                            image.isFeatured
                              ? "bg-orange-500 hover:bg-orange-600"
                              : "bg-white/20 hover:bg-white/30"
                          } text-white p-2 rounded-full transition-colors`}
                        >
                          {image.isFeatured ? (
                            <Star size={16} />
                          ) : (
                            <StarOff size={16} />
                          )}
                          {/*{console.log(image.isFeatured)}*/}
                        </button>
                        <button
                          onClick={() => {
                            openDeleteModal(image);
                            setSelectedImage(image);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-[#1E1E1E] rounded-xl p-12 text-center">
          <ImageIcon className="mx-auto text-gray-600 mb-4" size={48} />
          <h3 className="text-xl font-medium mb-2">No images found</h3>
          <p className="text-gray-400 mb-6">
            {selectedTab === "featured"
              ? "No featured images found. Mark some images as featured."
              : selectedTab === "positioned"
              ? "No positioned images found. Arrange your images to set positions."
              : "Your gallery is empty. Add some images to get started."}
          </p>
          {selectedTab === "all" && (
            <button
              onClick={() => setUploadModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              <Plus size={18} />
              <span>Add Image</span>
            </button>
          )}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-[#1E1E1E] rounded-xl p-6 w-full max-w-md relative"
            >
              <button
                onClick={() => {
                  if (!uploading) {
                    setUploadModalOpen(false);
                    setImageFile(null);
                    setImagePreview(null);
                  }
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                disabled={uploading}
              >
                <X size={24} />
              </button>

              <h2 className="text-xl font-bold mb-6">Upload New Image</h2>

              {uploadSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle
                    className="mx-auto text-green-500 mb-4"
                    size={48}
                  />
                  <h3 className="text-xl font-medium mb-2">
                    Upload Successful!
                  </h3>
                  <p className="text-gray-400">
                    Your image has been added to the gallery.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleUpload} onDragEnter={handleDrag}>
                  {imagePreview ? (
                    <div className="mb-6 relative">
                      <div className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {!uploading && (
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`mb-6 relative ${
                        dragActive ? "border-orange-500 bg-orange-500/10" : ""
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <label
                        htmlFor="image-upload"
                        className={`block w-full aspect-square border-2 border-dashed ${
                          dragActive ? "border-orange-500" : "border-gray-600"
                        } rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-colors`}
                      >
                        <Upload className="text-gray-400 mb-2" size={32} />
                        <p className="text-gray-400 text-center">
                          {dragActive
                            ? "Drop your image here"
                            : "Drag & drop or click to upload"}
                          <br />
                          <span className="text-sm">
                            PNG, JPG or WEBP (max 5MB)
                          </span>
                        </p>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                          disabled={uploading}
                          ref={fileInputRef}
                        />
                      </label>
                    </div>
                  )}

                  {uploading && (
                    <div className="mb-6">
                      <div className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-center text-sm text-gray-400 mt-2">
                        Uploading... {uploadProgress}%
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    disabled={!imageFile || uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        <span>Upload Image</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && selectedImage && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-[#1E1E1E] rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-2">Delete Image</h2>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete this image? This action cannot
                be undone.
              </p>

              <div className="mb-6">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={selectedImage.url || "/placeholder.svg"}
                    alt="Gallery image"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteImage}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewModalOpen && selectedImage && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl"
            >
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              <div className="relative">
                <div className="aspect-[16/9] rounded-lg overflow-hidden">
                  <Image
                    src={selectedImage.url || "/placeholder.svg"}
                    alt="Gallery image"
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                  <button
                    onClick={() => {
                      const currentIndex = filteredGallery.findIndex(
                        (img) => img._id === selectedImage._id
                      );
                      const prevIndex =
                        currentIndex > 0
                          ? currentIndex - 1
                          : filteredGallery.length - 1;
                      setSelectedImage(filteredGallery[prevIndex]);
                    }}
                    className="bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                </div>

                <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                  <button
                    onClick={() => {
                      const currentIndex = filteredGallery.findIndex(
                        (img) => img._id === selectedImage._id
                      );
                      const nextIndex =
                        currentIndex < filteredGallery.length - 1
                          ? currentIndex + 1
                          : 0;
                      setSelectedImage(filteredGallery[nextIndex]);
                    }}
                    className="bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>

              <div className="flex justify-center mt-4 gap-4">
                <button
                  onClick={() => {
                    toggleFeatured(selectedImage);
                    setSelectedImage((prev) => ({
                      ...prev,
                      isFeatured: !prev.isFeatured,
                    }));
                  }}
                  className={`${
                    selectedImage.isFeatured
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-[#2a2a2a] hover:bg-[#3a3a3a]"
                  } text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors`}
                >
                  {selectedImage.isFeatured ? (
                    <>
                      <StarOff size={18} />
                      <span>Remove Featured</span>
                    </>
                  ) : (
                    <>
                      <Star size={18} />
                      <span>Mark as Featured</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Position Selection Modal */}
      <AnimatePresence>
        {positionModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-[#1E1E1E] rounded-xl p-6 w-full max-w-5xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setPositionModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>

              <h2 className="text-xl font-bold mb-6">Arrange Gallery Images</h2>
              <p className="text-gray-400 mb-6">
                Select which images should appear in the first, second, and
                third positions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* First Position */}
                <div className="bg-[#2a2a2a] rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full mr-2">
                      1st
                    </span>
                    First Position
                  </h3>

                  {positionSelection.first ? (
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                      <Image
                        src={
                          getGallery.find(
                            (img) => img.publicId === positionSelection.first
                          )?.url || "/placeholder.svg"
                        }
                        alt="First position"
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() =>
                          setPositionSelection({
                            ...positionSelection,
                            first: null,
                          })
                        }
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="aspect-square rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center mb-3">
                      <p className="text-gray-400 text-sm text-center">
                        No image selected
                      </p>
                    </div>
                  )}
                </div>

                {/* Second Position */}
                <div className="bg-[#2a2a2a] rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full mr-2">
                      2nd
                    </span>
                    Second Position
                  </h3>

                  {positionSelection.second ? (
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                      <Image
                        src={
                          getGallery.find(
                            (img) => img.publicId === positionSelection.second
                          )?.url || "/placeholder.svg"
                        }
                        alt="Second position"
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() =>
                          setPositionSelection({
                            ...positionSelection,
                            second: null,
                          })
                        }
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="aspect-square rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center mb-3">
                      <p className="text-gray-400 text-sm text-center">
                        No image selected
                      </p>
                    </div>
                  )}
                </div>

                {/* Third Position */}
                <div className="bg-[#2a2a2a] rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full mr-2">
                      3rd
                    </span>
                    Third Position
                  </h3>

                  {positionSelection.third ? (
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                      <Image
                        src={
                          getGallery.find(
                            (img) => img.publicId === positionSelection.third
                          )?.url || "/placeholder.svg"
                        }
                        alt="Third position"
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() =>
                          setPositionSelection({
                            ...positionSelection,
                            third: null,
                          })
                        }
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="aspect-square rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center mb-3">
                      <p className="text-gray-400 text-sm text-center">
                        No image selected
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Image Selection Grid */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">
                  Select Images for Positions
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {getGallery.map((image) => {
                    // Determine if this image is already assigned to a position
                    const isFirst = positionSelection.first === image.publicId;
                    const isSecond =
                      positionSelection.second === image.publicId;
                    const isThird = positionSelection.third === image.publicId;
                    const isAssigned = isFirst || isSecond || isThird;
                    const isSelecting = selectingPosition === image.publicId;

                    return (
                      <div
                        key={image._id}
                        className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                          isAssigned
                            ? "ring-2 ring-purple-500"
                            : "hover:opacity-80"
                        }`}
                        onClick={() => {
                          if (!isSelecting && !isAssigned) {
                            setSelectingPosition(image.publicId);
                          } else if (isSelecting) {
                            setSelectingPosition(null);
                          }
                        }}
                      >
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt="Gallery image"
                          fill
                          className="object-cover"
                        />

                        {/* Position selection overlay */}
                        {isSelecting && (
                          <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-2 p-2">
                            <button
                              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePositionSelect(image.publicId, "first");
                              }}
                              disabled={
                                positionSelection.first === image.publicId
                              }
                            >
                              1st Position
                            </button>
                            <button
                              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePositionSelect(image.publicId, "second");
                              }}
                              disabled={
                                positionSelection.second === image.publicId
                              }
                            >
                              2nd Position
                            </button>
                            <button
                              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePositionSelect(image.publicId, "third");
                              }}
                              disabled={
                                positionSelection.third === image.publicId
                              }
                            >
                              3rd Position
                            </button>
                          </div>
                        )}

                        {/* Show position badge if assigned */}
                        {isAssigned && (
                          <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                            {isFirst ? "1st" : isSecond ? "2nd" : "3rd"}
                          </div>
                        )}

                        {/* Show featured badge if featured */}
                        {image.isFeatured && (
                          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                            Featured
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
