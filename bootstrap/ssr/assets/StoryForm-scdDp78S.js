import { t as MediaPicker } from "./MediaPicker-Dte0UALB.js";
import { router } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState, useTransition } from "react";
import dayjs from "dayjs";
//#region resources/js/Pages/Admin/Stories/StoryForm.tsx
function StoryForm({ story }) {
	const [isPending, startTransition] = useTransition();
	const [title, setTitle] = useState(story?.title || "");
	const [slug, setSlug] = useState(story?.slug || "");
	const [description, setDescription] = useState(story?.description || "");
	const [seoTitle, setSeoTitle] = useState(story?.seo_meta?.seo_title || story?.seoTitle || "");
	const [ogTitle, setOgTitle] = useState(story?.seo_meta?.og_title || "");
	const [ogDescription, setOgDescription] = useState(story?.seo_meta?.og_description || "");
	const [ogImage, setOgImage] = useState(story?.seo_meta?.og_image || "");
	const [articleLink, setArticleLink] = useState(story?.articleLink || "");
	const [category, setCategory] = useState(story?.category || "General");
	const [tags, setTags] = useState(story?.tags || []);
	const [posterImage, setPosterImage] = useState(story?.posterImage || "");
	const [squarePoster, setSquarePoster] = useState(story?.squarePoster || "");
	const [landscapePoster, setLandscapePoster] = useState(story?.landscapePoster || "");
	const [author, setAuthor] = useState(story?.author || "SEO Expert");
	const [authorBio, setAuthorBio] = useState(story?.authorBio || "");
	const [authorImage, setAuthorImage] = useState(story?.authorImage || "");
	const [authorSocials, setAuthorSocials] = useState(story?.authorSocials || {
		twitter: "",
		linkedin: "",
		website: ""
	});
	const [slides, setSlides] = useState(story?.pages || story?.slides || [{
		id: "sl1",
		image: "",
		text: "Slide 1"
	}]);
	const [id, setId] = useState(story?.id || "");
	const [isSponsored, setIsSponsored] = useState(story?.isSponsored || false);
	const [isNoIndex, setIsNoIndex] = useState(story?.isNoIndex || false);
	const [mediaPickerTarget, setMediaPickerTarget] = useState(null);
	const [availableAuthors, setAvailableAuthors] = useState([]);
	const [availableCategories, setAvailableCategories] = useState([]);
	useEffect(() => {
		if (!id && !story?.id) setId(crypto.randomUUID());
		fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/authors").then((r) => r.json()).then((data) => {
			if (Array.isArray(data)) setAvailableAuthors(data);
		}).catch((e) => console.error("Failed to load authors", e));
		fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/categories").then((r) => r.json()).then((data) => {
			if (Array.isArray(data)) setAvailableCategories(data);
		}).catch((e) => console.error("Failed to load categories", e));
	}, [id, story?.id]);
	const [uploading, setUploading] = useState(false);
	useRef(null);
	const uploadFile = async (file) => {
		setUploading(true);
		const formData = new FormData();
		formData.append("file", file);
		try {
			const result = await (await fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/upload", {
				method: "POST",
				body: formData
			})).json();
			setUploading(false);
			if (result.success && result.url) return result.url;
			else {
				alert(`Upload failed: ${result.error || "Unknown error"}`);
				return "";
			}
		} catch (e) {
			setUploading(false);
			alert(`Upload failed: ${e.message || "Connection error"}`);
			return "";
		}
	};
	const addSlide = () => {
		setSlides([...slides, {
			id: `sl${Date.now()}`,
			image: "",
			text: ""
		}]);
	};
	const updateSlide = (index, field, value) => {
		const newSlides = [...slides];
		newSlides[index] = {
			...newSlides[index],
			[field]: value
		};
		setSlides(newSlides);
	};
	const removeSlide = (index) => {
		const newSlides = [...slides];
		newSlides.splice(index, 1);
		setSlides(newSlides);
	};
	const handleSave = async (published) => {
		startTransition(async () => {
			const cleanSlug = (slug || title).toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
			const updatedStory = {
				id,
				title,
				slug: cleanSlug,
				description,
				seoTitle: seoTitle || void 0,
				ogTitle: ogTitle || void 0,
				ogDescription: ogDescription || void 0,
				ogImage: ogImage || void 0,
				articleLink: articleLink || void 0,
				category,
				tags,
				posterImage: posterImage || "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=640&h=853&q=80",
				squarePoster: squarePoster || posterImage || void 0,
				landscapePoster: landscapePoster || posterImage || void 0,
				date: story?.date || dayjs().format("YYYY-MM-DD"),
				lastModified: dayjs().format("YYYY-MM-DD"),
				author,
				authorBio: authorBio || void 0,
				authorImage: authorImage || void 0,
				authorSocials: authorSocials.twitter || authorSocials.linkedin || authorSocials.website ? authorSocials : void 0,
				slides,
				published,
				isSponsored: isSponsored || void 0,
				isNoIndex: isNoIndex || void 0
			};
			try {
				if (!(await fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/stories", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updatedStory)
				})).ok) throw new Error("Failed to save story");
				await new Promise((resolve) => setTimeout(resolve, 1e3));
				const BASE = typeof window !== "undefined" && window.location.pathname.startsWith("/list/public") ? "/list/public" : "";
				router.visit(BASE + "/admin/stories");
			} catch (error) {
				console.error("Save failed:", error);
				alert("Critical error: Web Story could not be deployed.");
			}
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		style: {
			position: "fixed",
			top: 0,
			left: 0,
			width: "100vw",
			height: "100vh",
			zIndex: 9999,
			background: "#f8fafc",
			overflowY: "auto"
		},
		children: [/* @__PURE__ */ jsxs("div", {
			style: {
				width: "100%",
				padding: "20px"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "30px"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: "15px"
					},
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							const BASE = typeof window !== "undefined" && window.location.pathname.startsWith("/list/public") ? "/list/public" : "";
							router.visit(BASE + "/admin/stories");
						},
						style: {
							background: "none",
							border: "none",
							fontSize: "20px",
							cursor: "pointer",
							color: "#64748b"
						},
						children: "←"
					}), /* @__PURE__ */ jsx("h1", {
						style: {
							fontSize: "24px",
							fontWeight: 600,
							margin: 0
						},
						children: story ? "Edit Web Story" : "New Web Story"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						gap: "10px"
					},
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => handleSave(false),
						disabled: isPending || uploading,
						style: draftBtn,
						children: "Save Draft"
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => handleSave(true),
						disabled: isPending || uploading,
						style: publishBtn,
						children: isPending ? "Saving..." : "Publish Story"
					})]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "20px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: panelStyle,
						children: [
							/* @__PURE__ */ jsx("h2", {
								style: panelHeader,
								children: "Story Details"
							}),
							/* @__PURE__ */ jsx("input", {
								value: title,
								onChange: (e) => setTitle(e.target.value),
								placeholder: "Story Title (max 90 chars)",
								maxLength: 90,
								style: inputStyle
							}),
							/* @__PURE__ */ jsx("input", {
								value: slug,
								onChange: (e) => setSlug(e.target.value),
								placeholder: "URL Slug (auto-generated if empty)",
								style: inputStyle
							}),
							/* @__PURE__ */ jsx("textarea", {
								value: description,
								onChange: (e) => setDescription(e.target.value),
								placeholder: "Meta Description for SEO (150-160 chars)",
								style: {
									...inputStyle,
									minHeight: "80px"
								}
							}),
							/* @__PURE__ */ jsx("input", {
								value: seoTitle,
								onChange: (e) => setSeoTitle(e.target.value),
								placeholder: "SEO Title Override (max 90 chars, leave empty to use title)",
								maxLength: 90,
								style: inputStyle
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "10px"
								},
								children: [/* @__PURE__ */ jsxs("select", {
									value: category,
									onChange: (e) => setCategory(e.target.value),
									style: {
										...inputStyle,
										flex: 1,
										marginBottom: 0
									},
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "",
											children: "-- Select Category --"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "General",
											children: "General"
										}),
										availableCategories.map((c) => /* @__PURE__ */ jsx("option", {
											value: c.name,
											children: c.name
										}, c.id))
									]
								}), /* @__PURE__ */ jsx("input", {
									value: tags.join(", "),
									onChange: (e) => setTags(e.target.value.split(",").map((t) => t.trim()).filter(Boolean)),
									placeholder: "Tags (comma separated)",
									style: {
										...inputStyle,
										flex: 2,
										marginBottom: 0
									}
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								style: {
									display: "flex",
									gap: "10px"
								},
								children: /* @__PURE__ */ jsx("input", {
									value: articleLink,
									onChange: (e) => setArticleLink(e.target.value),
									placeholder: "Swipe Up / Read Full Article Link (e.g. https://...)",
									style: {
										...inputStyle,
										marginBottom: 0
									}
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "20px",
									marginTop: "16px",
									padding: "14px",
									background: "#f1f5f9",
									borderRadius: "12px",
									border: "1px solid #e2e8f0"
								},
								children: [/* @__PURE__ */ jsxs("label", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "8px",
										cursor: "pointer",
										fontSize: "13px",
										fontWeight: 600
									},
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										checked: isSponsored,
										onChange: (e) => setIsSponsored(e.target.checked)
									}), "💰 Sponsored Story"]
								}), /* @__PURE__ */ jsxs("label", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "8px",
										cursor: "pointer",
										fontSize: "13px",
										fontWeight: 600,
										color: isNoIndex ? "#dc2626" : "#475569"
									},
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										checked: isNoIndex,
										onChange: (e) => setIsNoIndex(e.target.checked)
									}), "🚫 No Index (Exclude from Google)"]
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: panelStyle,
						children: [
							/* @__PURE__ */ jsx("h2", {
								style: panelHeader,
								children: "🌐 Social Media & Open Graph"
							}),
							/* @__PURE__ */ jsx("p", {
								style: {
									fontSize: "13px",
									color: "#64748b",
									marginBottom: "16px",
									lineHeight: 1.5
								},
								children: "Customize how this story appears when shared on Twitter, Facebook, LinkedIn, etc. If left empty, it will fall back to the main Story Title, Description, and Poster Image."
							}),
							/* @__PURE__ */ jsx("input", {
								value: ogTitle,
								onChange: (e) => setOgTitle(e.target.value),
								placeholder: "Open Graph Title (Optional)",
								maxLength: 90,
								style: inputStyle
							}),
							/* @__PURE__ */ jsx("textarea", {
								value: ogDescription,
								onChange: (e) => setOgDescription(e.target.value),
								placeholder: "Open Graph Description (Optional)",
								style: {
									...inputStyle,
									minHeight: "60px"
								}
							}),
							/* @__PURE__ */ jsx("label", {
								style: fieldLabel,
								children: "Open Graph Image (1200x630 recommended)"
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "10px"
								},
								children: [
									/* @__PURE__ */ jsx("input", {
										value: ogImage,
										onChange: (e) => setOgImage(e.target.value),
										placeholder: "Open Graph Image URL (Optional)",
										style: {
											...inputStyle,
											flex: 1,
											marginBottom: 0
										}
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setMediaPickerTarget({ type: "ogImage" }),
										style: {
											...uploadBtnStyle,
											background: "#f8fafc",
											border: "1px solid #e2e8f0"
										},
										children: "Library"
									}),
									/* @__PURE__ */ jsxs("label", {
										style: uploadBtnStyle,
										children: [uploading ? "..." : "Upload", /* @__PURE__ */ jsx("input", {
											type: "file",
											accept: "image/*",
											style: { display: "none" },
											onChange: async (e) => {
												if (e.target.files?.[0]) {
													const url = await uploadFile(e.target.files[0]);
													if (url) setOgImage(url);
												}
											}
										})]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: panelStyle,
						children: [
							/* @__PURE__ */ jsx("h2", {
								style: panelHeader,
								children: "📸 Google Discover Covers"
							}),
							/* @__PURE__ */ jsx("p", {
								style: {
									fontSize: "13px",
									color: "#64748b",
									marginBottom: "16px",
									lineHeight: 1.5
								},
								children: "Google Discover requires all 3 aspect ratios. Missing covers will fall back to the portrait image."
							}),
							/* @__PURE__ */ jsx("label", {
								style: fieldLabel,
								children: "Portrait Cover (9:16 — Required)"
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "10px",
									marginBottom: "16px"
								},
								children: [
									/* @__PURE__ */ jsx("input", {
										value: posterImage,
										onChange: (e) => setPosterImage(e.target.value),
										placeholder: "Portrait Poster Image URL (9:16)",
										style: {
											...inputStyle,
											flex: 1,
											marginBottom: 0
										}
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setMediaPickerTarget({ type: "poster" }),
										style: {
											...uploadBtnStyle,
											background: "#f8fafc",
											border: "1px solid #e2e8f0"
										},
										children: "Library"
									}),
									/* @__PURE__ */ jsxs("label", {
										style: uploadBtnStyle,
										children: [uploading ? "..." : "Upload", /* @__PURE__ */ jsx("input", {
											type: "file",
											accept: "image/*",
											style: { display: "none" },
											onChange: async (e) => {
												if (e.target.files?.[0]) {
													const url = await uploadFile(e.target.files[0]);
													if (url) setPosterImage(url);
												}
											}
										})]
									})
								]
							}),
							/* @__PURE__ */ jsx("label", {
								style: fieldLabel,
								children: "Square Cover (1:1 — For Discover Grid)"
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "10px",
									marginBottom: "16px"
								},
								children: [
									/* @__PURE__ */ jsx("input", {
										value: squarePoster,
										onChange: (e) => setSquarePoster(e.target.value),
										placeholder: "Square Poster Image URL (1:1) — Optional, falls back to portrait",
										style: {
											...inputStyle,
											flex: 1,
											marginBottom: 0
										}
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setMediaPickerTarget({ type: "square" }),
										style: {
											...uploadBtnStyle,
											background: "#f8fafc",
											border: "1px solid #e2e8f0"
										},
										children: "Library"
									}),
									/* @__PURE__ */ jsxs("label", {
										style: uploadBtnStyle,
										children: [uploading ? "..." : "Upload", /* @__PURE__ */ jsx("input", {
											type: "file",
											accept: "image/*",
											style: { display: "none" },
											onChange: async (e) => {
												if (e.target.files?.[0]) {
													const url = await uploadFile(e.target.files[0]);
													if (url) setSquarePoster(url);
												}
											}
										})]
									})
								]
							}),
							/* @__PURE__ */ jsx("label", {
								style: fieldLabel,
								children: "Landscape Cover (16:9 — For Search Thumbnails)"
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "10px"
								},
								children: [
									/* @__PURE__ */ jsx("input", {
										value: landscapePoster,
										onChange: (e) => setLandscapePoster(e.target.value),
										placeholder: "Landscape Poster Image URL (16:9) — Optional, falls back to portrait",
										style: {
											...inputStyle,
											flex: 1,
											marginBottom: 0
										}
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setMediaPickerTarget({ type: "landscape" }),
										style: {
											...uploadBtnStyle,
											background: "#f8fafc",
											border: "1px solid #e2e8f0"
										},
										children: "Library"
									}),
									/* @__PURE__ */ jsxs("label", {
										style: uploadBtnStyle,
										children: [uploading ? "..." : "Upload", /* @__PURE__ */ jsx("input", {
											type: "file",
											accept: "image/*",
											style: { display: "none" },
											onChange: async (e) => {
												if (e.target.files?.[0]) {
													const url = await uploadFile(e.target.files[0]);
													if (url) setLandscapePoster(url);
												}
											}
										})]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: panelStyle,
						children: [/* @__PURE__ */ jsx("h2", {
							style: panelHeader,
							children: "Author & Publisher"
						}), availableAuthors.length > 0 && /* @__PURE__ */ jsxs("div", {
							style: {
								marginBottom: "16px",
								background: "#f8fafc",
								padding: "16px",
								borderRadius: "12px",
								border: "1px solid #e2e8f0"
							},
							children: [/* @__PURE__ */ jsx("label", {
								style: fieldLabel,
								children: "Select Saved Author Profile"
							}), /* @__PURE__ */ jsxs("select", {
								style: {
									...inputStyle,
									marginBottom: 0
								},
								value: availableAuthors.find((a) => a.name === author)?.id || "",
								onChange: (e) => {
									const selected = availableAuthors.find((a) => a.id === e.target.value);
									if (selected) {
										setAuthor(selected.name);
										if (selected.image) setAuthorImage(selected.image);
										if (selected.bio) setAuthorBio(selected.bio);
										if (selected.socials) setAuthorSocials(selected.socials);
									}
								},
								children: [/* @__PURE__ */ jsx("option", {
									value: "",
									children: "-- Select an Author --"
								}), availableAuthors.map((a) => /* @__PURE__ */ jsx("option", {
									value: a.id,
									children: a.name
								}, a.id))]
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: panelStyle,
						children: [
							/* @__PURE__ */ jsx("h2", {
								style: panelHeader,
								children: "Slides"
							}),
							slides.map((slide, index) => /* @__PURE__ */ jsxs("div", {
								style: slideBox,
								children: [/* @__PURE__ */ jsxs("div", {
									style: {
										flex: 1,
										display: "flex",
										flexDirection: "column"
									},
									children: [
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												justifyContent: "space-between",
												marginBottom: "10px",
												fontSize: "14px",
												fontWeight: 600
											},
											children: [
												"Slide ",
												index + 1,
												slides.length > 1 && /* @__PURE__ */ jsx("button", {
													onClick: () => removeSlide(index),
													style: delBtn,
													children: "Remove"
												})
											]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												gap: "10px",
												marginBottom: "10px"
											},
											children: [
												/* @__PURE__ */ jsx("input", {
													value: slide.image,
													onChange: (e) => updateSlide(index, "image", e.target.value),
													placeholder: "Image URL",
													style: {
														...inputStyle,
														marginBottom: 0
													}
												}),
												/* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => setMediaPickerTarget({
														type: "slide",
														index
													}),
													style: {
														...uploadBtnStyle,
														background: "#f8fafc",
														border: "1px solid #e2e8f0",
														marginBottom: 0
													},
													children: "Library"
												}),
												/* @__PURE__ */ jsxs("label", {
													style: {
														...uploadBtnStyle,
														marginBottom: 0
													},
													children: [uploading ? "..." : "Upload", /* @__PURE__ */ jsx("input", {
														type: "file",
														accept: "image/*",
														style: { display: "none" },
														onChange: async (e) => {
															if (e.target.files?.[0]) {
																const url = await uploadFile(e.target.files[0]);
																if (url) updateSlide(index, "image", url);
															}
														}
													})]
												})
											]
										}),
										/* @__PURE__ */ jsx("textarea", {
											value: slide.text || "",
											onChange: (e) => updateSlide(index, "text", e.target.value),
											placeholder: "Overlay Text",
											style: {
												...inputStyle,
												minHeight: "60px"
											}
										})
									]
								}), slide.image && /* @__PURE__ */ jsx("div", {
									style: {
										width: "120px",
										height: "160px",
										background: "#e2e8f0",
										borderRadius: "8px",
										overflow: "hidden"
									},
									children: /* @__PURE__ */ jsx("img", {
										loading: "lazy",
										decoding: "async",
										fetchPriority: "low",
										src: slide.image,
										alt: "Preview",
										style: {
											width: "100%",
											height: "100%",
											objectFit: "cover"
										}
									})
								})]
							}, slide.id)),
							/* @__PURE__ */ jsx("button", {
								onClick: addSlide,
								style: addBtn,
								children: "+ Add New Slide"
							})
						]
					})
				]
			})]
		}), mediaPickerTarget && /* @__PURE__ */ jsx(MediaPicker, {
			onSelect: (url) => {
				if (mediaPickerTarget.type === "poster") setPosterImage(url);
				if (mediaPickerTarget.type === "square") setSquarePoster(url);
				if (mediaPickerTarget.type === "landscape") setLandscapePoster(url);
				if (mediaPickerTarget.type === "ogImage") setOgImage(url);
				if (mediaPickerTarget.type === "author") setAuthorImage(url);
				if (mediaPickerTarget.type === "slide" && mediaPickerTarget.index !== void 0) updateSlide(mediaPickerTarget.index, "image", url);
				setMediaPickerTarget(null);
			},
			onClose: () => setMediaPickerTarget(null)
		})]
	});
}
var fieldLabel = {
	fontSize: "12px",
	fontWeight: 700,
	color: "#64748b",
	display: "block",
	marginBottom: "6px"
};
var draftBtn = {
	background: "#f1f5f9",
	color: "#475569",
	border: "none",
	padding: "10px 20px",
	borderRadius: "8px",
	cursor: "pointer",
	fontWeight: 600,
	fontSize: "14px"
};
var publishBtn = {
	background: "#2563eb",
	color: "#fff",
	border: "none",
	padding: "10px 24px",
	borderRadius: "8px",
	cursor: "pointer",
	fontWeight: 600,
	fontSize: "14px"
};
var panelStyle = {
	background: "#ffffff",
	padding: "24px",
	borderRadius: "16px",
	border: "1px solid #e2e8f0",
	marginBottom: "20px"
};
var panelHeader = {
	margin: "0 0 20px 0",
	fontSize: "18px",
	fontWeight: 700
};
var inputStyle = {
	width: "100%",
	padding: "12px 16px",
	marginBottom: "16px",
	border: "1px solid #e2e8f0",
	borderRadius: "10px",
	fontSize: "14px",
	boxSizing: "border-box"
};
var uploadBtnStyle = {
	background: "#f1f5f9",
	padding: "12px 20px",
	borderRadius: "10px",
	cursor: "pointer",
	fontSize: "14px",
	fontWeight: 600,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	whiteSpace: "nowrap"
};
var slideBox = {
	display: "flex",
	gap: "20px",
	padding: "20px",
	border: "1px solid #e2e8f0",
	borderRadius: "12px",
	marginBottom: "16px",
	background: "#f8fafc"
};
var delBtn = {
	background: "#fee2e2",
	color: "#dc2626",
	border: "none",
	padding: "8px 16px",
	borderRadius: "8px",
	cursor: "pointer"
};
var addBtn = {
	width: "100%",
	padding: "16px",
	background: "#f8fafc",
	border: "2px dashed #cbd5e1",
	borderRadius: "12px",
	cursor: "pointer",
	fontWeight: 600
};
//#endregion
export { StoryForm as default };
