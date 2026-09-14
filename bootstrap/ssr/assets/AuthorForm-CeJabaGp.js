import { t as MediaPicker } from "./MediaPicker-Dte0UALB.js";
import { router } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
//#region resources/js/Pages/Admin/Authors/AuthorForm.tsx
function AuthorForm({ author }) {
	const [name, setName] = useState(author?.name || "");
	const [bio, setBio] = useState(author?.bio || "");
	const [image, setImage] = useState(author?.image || "");
	const [jobTitle, setJobTitle] = useState(author?.jobTitle || "");
	const [experienceYears, setExperienceYears] = useState(author?.experienceYears || 0);
	const [twitter, setTwitter] = useState(author?.socials?.twitter || "");
	const [linkedin, setLinkedin] = useState(author?.socials?.linkedin || "");
	const [website, setWebsite] = useState(author?.socials?.website || "");
	const [awards, setAwards] = useState(author?.awards || []);
	const [awardInput, setAwardInput] = useState("");
	const [alumniOf, setAlumniOf] = useState(author?.alumniOf || []);
	const [alumniName, setAlumniName] = useState("");
	const [alumniSameAs, setAlumniSameAs] = useState("");
	const [knowsAbout, setKnowsAbout] = useState(author?.knowsAbout || []);
	const [knowsAboutName, setKnowsAboutName] = useState("");
	const [knowsAboutSameAs, setKnowsAboutSameAs] = useState("");
	const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const handleImageUpload = async (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		event.target.value = "";
		const formData = new FormData();
		formData.append("file", file);
		try {
			const result = await (await fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/upload", {
				method: "POST",
				body: formData
			})).json();
			if (result.success && result.url) setImage(result.url);
			else alert(`Upload failed: ${result.error || "Unknown error"}`);
		} catch (e) {
			console.error(e);
			alert(`Upload error: ${e.message || "Unknown error"}`);
		}
	};
	const handleSave = async () => {
		if (!name) return alert("Name is required");
		setIsSaving(true);
		const newAuthor = {
			id: author?.id || crypto.randomUUID(),
			name,
			bio,
			image,
			jobTitle,
			experienceYears,
			awards: awards.length > 0 ? awards : void 0,
			alumniOf: alumniOf.length > 0 ? alumniOf : void 0,
			knowsAbout: knowsAbout.length > 0 ? knowsAbout : void 0,
			socials: {
				twitter,
				linkedin,
				website
			}
		};
		try {
			if ((await fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/authors", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newAuthor)
			})).ok) {
				const BASE = typeof window !== "undefined" && window.location.pathname.startsWith("/list/public") ? "/list/public" : "";
				router.visit(BASE + "/admin/authors");
			} else alert("Failed to save");
		} catch (e) {
			console.error(e);
			alert("Error saving author");
		}
		setIsSaving(false);
	};
	return /* @__PURE__ */ jsxs("div", {
		style: {
			maxWidth: "800px",
			margin: "0 auto",
			background: "#fff",
			padding: "2rem",
			borderRadius: "16px",
			boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
		},
		children: [
			/* @__PURE__ */ jsx("h2", {
				style: { marginBottom: "2rem" },
				children: author ? "Edit Author Profile" : "New Author Profile"
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "1.5rem"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "8px"
						},
						children: [/* @__PURE__ */ jsx("label", {
							style: {
								fontWeight: 700,
								fontSize: "14px",
								color: "#475569"
							},
							children: "Name"
						}), /* @__PURE__ */ jsx("input", {
							value: name,
							onChange: (e) => setName(e.target.value),
							style: {
								padding: "10px 14px",
								border: "1px solid #e2e8f0",
								borderRadius: "8px",
								fontSize: "14px"
							},
							placeholder: "John Doe"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "8px"
						},
						children: [/* @__PURE__ */ jsx("label", {
							style: {
								fontWeight: 700,
								fontSize: "14px",
								color: "#475569"
							},
							children: "Job Title"
						}), /* @__PURE__ */ jsx("input", {
							value: jobTitle,
							onChange: (e) => setJobTitle(e.target.value),
							style: {
								padding: "10px 14px",
								border: "1px solid #e2e8f0",
								borderRadius: "8px",
								fontSize: "14px"
							},
							placeholder: "Senior Editor"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "8px"
						},
						children: [/* @__PURE__ */ jsx("label", {
							style: {
								fontWeight: 700,
								fontSize: "14px",
								color: "#475569"
							},
							children: "Bio"
						}), /* @__PURE__ */ jsx("textarea", {
							value: bio,
							onChange: (e) => setBio(e.target.value),
							style: {
								padding: "10px 14px",
								border: "1px solid #e2e8f0",
								borderRadius: "8px",
								fontSize: "14px",
								minHeight: "100px"
							}
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "8px"
						},
						children: [
							/* @__PURE__ */ jsx("label", {
								style: {
									fontWeight: 700,
									fontSize: "14px",
									color: "#475569"
								},
								children: "Profile Image URL"
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "10px"
								},
								children: [
									/* @__PURE__ */ jsx("input", {
										value: image,
										onChange: (e) => setImage(e.target.value),
										style: {
											flex: 1,
											padding: "10px 14px",
											border: "1px solid #e2e8f0",
											borderRadius: "8px",
											fontSize: "14px"
										}
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setIsMediaPickerOpen(true),
										style: {
											background: "#f8fafc",
											padding: "10px 20px",
											borderRadius: "8px",
											border: "1px solid #e2e8f0",
											cursor: "pointer",
											fontWeight: 600,
											fontSize: "14px",
											color: "#475569"
										},
										children: "Library"
									}),
									/* @__PURE__ */ jsxs("label", {
										style: {
											background: "#f1f5f9",
											padding: "10px 20px",
											borderRadius: "8px",
											cursor: "pointer",
											fontWeight: 600,
											fontSize: "14px"
										},
										children: ["Upload", /* @__PURE__ */ jsx("input", {
											type: "file",
											hidden: true,
											accept: "image/*",
											onChange: handleImageUpload
										})]
									})
								]
							}),
							image && /* @__PURE__ */ jsx("img", {
								loading: "lazy",
								decoding: "async",
								fetchPriority: "low",
								src: image,
								alt: "Preview",
								style: {
									width: "80px",
									height: "80px",
									borderRadius: "50%",
									objectFit: "cover",
									marginTop: "10px"
								}
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "8px"
						},
						children: [/* @__PURE__ */ jsx("label", {
							style: {
								fontWeight: 700,
								fontSize: "14px",
								color: "#475569"
							},
							children: "Experience (Years)"
						}), /* @__PURE__ */ jsx("input", {
							type: "number",
							value: experienceYears,
							onChange: (e) => setExperienceYears(parseInt(e.target.value) || 0),
							style: {
								padding: "10px 14px",
								border: "1px solid #e2e8f0",
								borderRadius: "8px",
								fontSize: "14px"
							}
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "1rem"
						},
						children: [
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: "8px"
								},
								children: [/* @__PURE__ */ jsx("label", {
									style: {
										fontWeight: 700,
										fontSize: "14px",
										color: "#475569"
									},
									children: "Twitter URL"
								}), /* @__PURE__ */ jsx("input", {
									value: twitter,
									onChange: (e) => setTwitter(e.target.value),
									style: {
										padding: "10px 14px",
										border: "1px solid #e2e8f0",
										borderRadius: "8px",
										fontSize: "14px"
									}
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: "8px"
								},
								children: [/* @__PURE__ */ jsx("label", {
									style: {
										fontWeight: 700,
										fontSize: "14px",
										color: "#475569"
									},
									children: "LinkedIn URL"
								}), /* @__PURE__ */ jsx("input", {
									value: linkedin,
									onChange: (e) => setLinkedin(e.target.value),
									style: {
										padding: "10px 14px",
										border: "1px solid #e2e8f0",
										borderRadius: "8px",
										fontSize: "14px"
									}
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: "8px"
								},
								children: [/* @__PURE__ */ jsx("label", {
									style: {
										fontWeight: 700,
										fontSize: "14px",
										color: "#475569"
									},
									children: "Website URL"
								}), /* @__PURE__ */ jsx("input", {
									value: website,
									onChange: (e) => setWebsite(e.target.value),
									style: {
										padding: "10px 14px",
										border: "1px solid #e2e8f0",
										borderRadius: "8px",
										fontSize: "14px"
									}
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "8px",
							background: "#f8fafc",
							padding: "1rem",
							borderRadius: "8px"
						},
						children: [
							/* @__PURE__ */ jsx("label", {
								style: {
									fontWeight: 700,
									fontSize: "14px",
									color: "#475569"
								},
								children: "Awards & Recognitions"
							}),
							awards.map((award, i) => /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "10px",
									alignItems: "center"
								},
								children: [/* @__PURE__ */ jsxs("span", {
									style: { fontSize: "14px" },
									children: ["🏆 ", award]
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => setAwards(awards.filter((_, idx) => idx !== i)),
									style: {
										border: "none",
										background: "none",
										color: "#dc2626",
										cursor: "pointer"
									},
									children: "✕"
								})]
							}, i)),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "10px"
								},
								children: [/* @__PURE__ */ jsx("input", {
									value: awardInput,
									onChange: (e) => setAwardInput(e.target.value),
									placeholder: "e.g. Best Editor 2023",
									style: {
										flex: 1,
										padding: "10px 14px",
										border: "1px solid #e2e8f0",
										borderRadius: "8px",
										fontSize: "14px"
									}
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => {
										if (awardInput.trim()) {
											setAwards([...awards, awardInput.trim()]);
											setAwardInput("");
										}
									},
									style: {
										background: "#e2e8f0",
										border: "none",
										padding: "0 16px",
										borderRadius: "8px",
										fontWeight: 600,
										cursor: "pointer"
									},
									children: "Add"
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "8px",
							background: "#f8fafc",
							padding: "1rem",
							borderRadius: "8px"
						},
						children: [
							/* @__PURE__ */ jsx("label", {
								style: {
									fontWeight: 700,
									fontSize: "14px",
									color: "#475569"
								},
								children: "Education / Alumni Of"
							}),
							alumniOf.map((alumni, i) => /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "10px",
									alignItems: "center"
								},
								children: [/* @__PURE__ */ jsxs("span", {
									style: { fontSize: "14px" },
									children: ["🎓 ", alumni.name]
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => setAlumniOf(alumniOf.filter((_, idx) => idx !== i)),
									style: {
										border: "none",
										background: "none",
										color: "#dc2626",
										cursor: "pointer"
									},
									children: "✕"
								})]
							}, i)),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "10px"
								},
								children: [
									/* @__PURE__ */ jsx("input", {
										value: alumniName,
										onChange: (e) => setAlumniName(e.target.value),
										placeholder: "Institution Name",
										style: {
											flex: 1,
											padding: "10px 14px",
											border: "1px solid #e2e8f0",
											borderRadius: "8px",
											fontSize: "14px"
										}
									}),
									/* @__PURE__ */ jsx("input", {
										value: alumniSameAs,
										onChange: (e) => setAlumniSameAs(e.target.value),
										placeholder: "URL (e.g. Wikipedia link)",
										style: {
											flex: 1,
											padding: "10px 14px",
											border: "1px solid #e2e8f0",
											borderRadius: "8px",
											fontSize: "14px"
										}
									}),
									/* @__PURE__ */ jsx("button", {
										onClick: () => {
											if (alumniName.trim()) {
												setAlumniOf([...alumniOf, {
													name: alumniName.trim(),
													sameAs: alumniSameAs.trim()
												}]);
												setAlumniName("");
												setAlumniSameAs("");
											}
										},
										style: {
											background: "#e2e8f0",
											border: "none",
											padding: "0 16px",
											borderRadius: "8px",
											fontWeight: 600,
											cursor: "pointer"
										},
										children: "Add"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "8px",
							background: "#f8fafc",
							padding: "1rem",
							borderRadius: "8px"
						},
						children: [
							/* @__PURE__ */ jsx("label", {
								style: {
									fontWeight: 700,
									fontSize: "14px",
									color: "#475569"
								},
								children: "Expertise Topics (Knows About)"
							}),
							knowsAbout.map((topic, i) => /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "10px",
									alignItems: "center"
								},
								children: [/* @__PURE__ */ jsxs("span", {
									style: { fontSize: "14px" },
									children: ["💡 ", topic.name]
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => setKnowsAbout(knowsAbout.filter((_, idx) => idx !== i)),
									style: {
										border: "none",
										background: "none",
										color: "#dc2626",
										cursor: "pointer"
									},
									children: "✕"
								})]
							}, i)),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "10px"
								},
								children: [
									/* @__PURE__ */ jsx("input", {
										value: knowsAboutName,
										onChange: (e) => setKnowsAboutName(e.target.value),
										placeholder: "Topic Name",
										style: {
											flex: 1,
											padding: "10px 14px",
											border: "1px solid #e2e8f0",
											borderRadius: "8px",
											fontSize: "14px"
										}
									}),
									/* @__PURE__ */ jsx("input", {
										value: knowsAboutSameAs,
										onChange: (e) => setKnowsAboutSameAs(e.target.value),
										placeholder: "URL (e.g. Wikipedia link)",
										style: {
											flex: 1,
											padding: "10px 14px",
											border: "1px solid #e2e8f0",
											borderRadius: "8px",
											fontSize: "14px"
										}
									}),
									/* @__PURE__ */ jsx("button", {
										onClick: () => {
											if (knowsAboutName.trim()) {
												setKnowsAbout([...knowsAbout, {
													name: knowsAboutName.trim(),
													sameAs: knowsAboutSameAs.trim()
												}]);
												setKnowsAboutName("");
												setKnowsAboutSameAs("");
											}
										},
										style: {
											background: "#e2e8f0",
											border: "none",
											padding: "0 16px",
											borderRadius: "8px",
											fontWeight: 600,
											cursor: "pointer"
										},
										children: "Add"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: handleSave,
						disabled: isSaving,
						style: {
							marginTop: "1rem",
							background: "#2563eb",
							color: "#fff",
							padding: "14px",
							borderRadius: "10px",
							fontSize: "16px",
							fontWeight: 800,
							border: "none",
							cursor: isSaving ? "not-allowed" : "pointer"
						},
						children: isSaving ? "Saving..." : "Save Author Profile"
					})
				]
			}),
			isMediaPickerOpen && /* @__PURE__ */ jsx(MediaPicker, {
				onSelect: (url) => {
					setImage(url);
					setIsMediaPickerOpen(false);
				},
				onClose: () => setIsMediaPickerOpen(false)
			})
		]
	});
}
//#endregion
export { AuthorForm as default };
