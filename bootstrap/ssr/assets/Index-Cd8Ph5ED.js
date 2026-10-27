import AdminLayout from "./AdminLayout-CeDz327F.js";
import { Head } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Building2, GraduationCap, Inbox, MessageCircle, Phone, RefreshCw, Search, Trash2, X } from "lucide-react";
import axios from "axios";
//#region resources/js/Pages/Admin/Inquiries/Index.jsx
function InquiriesPage() {
	const [inquiries, setInquiries] = useState([]);
	const [stats, setStats] = useState({
		total: 0,
		new: 0,
		contacted: 0,
		admitted: 0,
		closed: 0
	});
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [updatingId, setUpdatingId] = useState(null);
	const basePath = typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "";
	const fetchInquiries = async (queryOverride = null) => {
		setLoading(true);
		try {
			const activeSearch = queryOverride !== null ? queryOverride : searchQuery;
			const params = new URLSearchParams();
			if (activeSearch) params.append("search", activeSearch);
			if (statusFilter !== "all") params.append("status", statusFilter);
			const res = await axios.get(`${basePath}/api/admin/inquiries?${params.toString()}`);
			if (res.data?.success) {
				setInquiries(res.data.inquiries?.data || []);
				if (res.data.stats) setStats(res.data.stats);
			}
		} catch (err) {
			console.error("Failed to fetch inquiries:", err);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchInquiries();
	}, [statusFilter]);
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		fetchInquiries();
	};
	const handleClearSearch = () => {
		setSearchQuery("");
		fetchInquiries("");
	};
	const handleStatusChange = async (id, newStatus) => {
		setUpdatingId(id);
		try {
			await axios.patch(`${basePath}/api/admin/inquiries/${id}/status`, { status: newStatus });
			setInquiries((prev) => prev.map((item) => item.id === id ? {
				...item,
				status: newStatus
			} : item));
			const statsRes = await axios.get(`${basePath}/api/admin/inquiries?per_page=1`);
			if (statsRes.data?.stats) setStats(statsRes.data.stats);
		} catch (err) {
			alert("Error updating inquiry status");
		} finally {
			setUpdatingId(null);
		}
	};
	const handleDelete = async (id) => {
		if (!confirm("Are you sure you want to permanently delete this inquiry?")) return;
		try {
			await axios.delete(`${basePath}/api/admin/inquiries/${id}`);
			setInquiries((prev) => prev.filter((item) => item.id !== id));
			setStats((prev) => ({
				...prev,
				total: Math.max(0, prev.total - 1)
			}));
		} catch (err) {
			alert("Error deleting inquiry");
		}
	};
	const cleanPhone = (phoneStr) => {
		const raw = (phoneStr || "").replace(/[^0-9]/g, "");
		return raw.startsWith("91") ? raw : raw.length === 10 ? `91${raw}` : raw;
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		style: { fontFamily: "var(--font-sans, \"Outfit\", system-ui, -apple-system, sans-serif)" },
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Direct Student Inquiries & Leads | Admin" }),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h1", {
					className: "text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5",
					children: [/* @__PURE__ */ jsx(GraduationCap, { className: "w-8 h-8 text-amber-500" }), /* @__PURE__ */ jsx("span", { children: "Institute Inquiries & Leads" })]
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1",
					children: "Real-time admission inquiries and WhatsApp leads submitted through institute profiles."
				})] }), /* @__PURE__ */ jsxs("button", {
					onClick: () => fetchInquiries(),
					className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer",
					children: [/* @__PURE__ */ jsx(RefreshCw, { className: `w-3.5 h-3.5 ${loading ? "animate-spin" : ""}` }), /* @__PURE__ */ jsx("span", { children: "Refresh Leads" })]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-xs font-bold uppercase tracking-wider text-slate-400",
							children: "Total Leads"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1",
							children: stats.total
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 shadow-sm",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400",
							children: "New (Uncontacted)"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1",
							children: stats.new
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/40 shadow-sm",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400",
							children: "Contacted"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 mt-1",
							children: stats.contacted
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 shadow-sm",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400",
							children: "Admitted"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1",
							children: stats.admitted
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center",
				children: [/* @__PURE__ */ jsx("form", {
					onSubmit: handleSearchSubmit,
					className: "relative flex-1 max-w-md w-full",
					children: /* @__PURE__ */ jsxs("div", {
						className: "relative flex items-center w-full",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500",
								children: /* @__PURE__ */ jsx(Search, { className: "w-4 h-4" })
							}),
							/* @__PURE__ */ jsx("input", {
								type: "text",
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								placeholder: "Search by student name, phone, course, or institute...",
								className: "w-full h-10 pl-10 pr-24 bg-slate-100 dark:bg-zinc-800 border border-slate-200/60 dark:border-zinc-700/60 focus:border-amber-500 focus:bg-white dark:focus:bg-zinc-900 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-500",
								style: { fontFamily: "var(--font-sans, \"Outfit\", system-ui, -apple-system, sans-serif)" }
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "absolute inset-y-0 right-0 pr-1.5 flex items-center gap-1",
								children: [searchQuery && /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: handleClearSearch,
									className: "p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition cursor-pointer flex items-center justify-center",
									title: "Clear search",
									children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									className: "h-7.5 px-3.5 flex items-center justify-center bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap",
									style: { fontFamily: "var(--font-sans, \"Outfit\", system-ui, -apple-system, sans-serif)" },
									children: "Search"
								})]
							})
						]
					})
				}), /* @__PURE__ */ jsx("div", {
					className: "flex gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl overflow-x-auto no-scrollbar",
					children: [
						{
							id: "all",
							label: "All"
						},
						{
							id: "new",
							label: "New"
						},
						{
							id: "contacted",
							label: "Contacted"
						},
						{
							id: "admitted",
							label: "Admitted"
						},
						{
							id: "closed",
							label: "Closed"
						}
					].map((tab) => /* @__PURE__ */ jsx("button", {
						onClick: () => setStatusFilter(tab.id),
						className: `px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${statusFilter === tab.id ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-600 dark:text-zinc-400 hover:text-slate-900"}`,
						children: tab.label
					}, tab.id))
				})]
			}),
			loading ? /* @__PURE__ */ jsxs("div", {
				className: "text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 text-slate-500 text-xs",
				children: [/* @__PURE__ */ jsx(RefreshCw, { className: "w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" }), "Loading inquiries..."]
			}) : inquiries.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-2",
				children: [
					/* @__PURE__ */ jsx(Inbox, { className: "w-10 h-10 mx-auto text-slate-300 dark:text-zinc-700" }),
					/* @__PURE__ */ jsx("h3", {
						className: "font-bold text-slate-800 dark:text-zinc-200 text-base",
						children: "No inquiries found"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto",
						children: searchQuery ? "Try adjusting your search terms or filter." : "Inquiries submitted through institute pages will appear here."
					})
				]
			}) : /* @__PURE__ */ jsx("div", {
				className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden",
				children: /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full min-w-[700px] text-left text-xs border-collapse",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "bg-slate-50 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 uppercase font-bold border-b border-slate-200 dark:border-zinc-700",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "p-3.5",
									children: "Student / Contact"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-3.5",
									children: "Target Institute"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-3.5",
									children: "Course & Query"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-3.5",
									children: "Status"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-3.5",
									children: "Received"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-3.5 text-right",
									children: "Quick Actions"
								})
							] })
						}), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-slate-100 dark:divide-zinc-800 font-medium",
							children: inquiries.map((item) => {
								const targetWa = cleanPhone(item.phone);
								const isUpdating = updatingId === item.id;
								return /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "p-3.5",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ jsx("div", {
													className: "w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xs shrink-0",
													children: item.student_name?.[0]?.toUpperCase() || "S"
												}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
													className: "font-extrabold text-slate-900 dark:text-white text-sm",
													children: item.student_name
												}), /* @__PURE__ */ jsxs("div", {
													className: "text-slate-500 font-mono text-[11px] flex items-center gap-1 mt-0.5",
													children: [/* @__PURE__ */ jsx(Phone, { className: "w-3 h-3 text-slate-400" }), /* @__PURE__ */ jsx("a", {
														href: `tel:${item.phone}`,
														className: "hover:text-blue-600 hover:underline",
														children: item.phone
													})]
												})] })]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-3.5",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-1.5 text-slate-800 dark:text-zinc-200 font-bold",
												children: [/* @__PURE__ */ jsx(Building2, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }), /* @__PURE__ */ jsx("span", { children: item.business?.name || item.business_name || "Direct Institute" })]
											})
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "p-3.5 max-w-xs",
											children: [/* @__PURE__ */ jsx("span", {
												className: "inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-[11px] mb-1",
												children: item.course || "General Inquiry"
											}), item.message && /* @__PURE__ */ jsxs("p", {
												className: "text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed",
												children: [
													"\"",
													item.message,
													"\""
												]
											})]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-3.5",
											children: /* @__PURE__ */ jsxs("select", {
												value: item.status,
												disabled: isUpdating,
												onChange: (e) => handleStatusChange(item.id, e.target.value),
												className: "text-xs font-bold rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1 text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-amber-500/20",
												children: [
													/* @__PURE__ */ jsx("option", {
														value: "new",
														children: "🟡 New"
													}),
													/* @__PURE__ */ jsx("option", {
														value: "contacted",
														children: "🔵 Contacted"
													}),
													/* @__PURE__ */ jsx("option", {
														value: "admitted",
														children: "🟢 Admitted"
													}),
													/* @__PURE__ */ jsx("option", {
														value: "closed",
														children: "⚪ Closed"
													})
												]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-3.5 text-slate-500 whitespace-nowrap text-[11px]",
											children: new Date(item.created_at).toLocaleDateString("en-IN", {
												day: "numeric",
												month: "short",
												year: "numeric"
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-3.5 text-right",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-end gap-1.5",
												children: [
													/* @__PURE__ */ jsx("a", {
														href: `https://wa.me/${targetWa}?text=${encodeURIComponent(`Hello ${item.student_name}, thank you for inquiring about ${item.course || "admission"} at ${item.business_name || "the coaching institute"}. How can we assist you?`)}`,
														target: "_blank",
														rel: "noopener noreferrer",
														title: "Chat on WhatsApp",
														className: "p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition",
														children: /* @__PURE__ */ jsx(MessageCircle, { className: "w-4 h-4" })
													}),
													/* @__PURE__ */ jsx("a", {
														href: `tel:${item.phone}`,
														title: "Call Student",
														className: "p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition",
														children: /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4" })
													}),
													/* @__PURE__ */ jsx("button", {
														onClick: () => handleDelete(item.id),
														title: "Delete Lead",
														className: "p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer",
														children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
													})
												]
											})
										})
									]
								}, item.id);
							})
						})]
					})
				})
			})
		]
	});
}
InquiriesPage.layout = (page) => /* @__PURE__ */ jsx(AdminLayout, { children: page });
//#endregion
export { InquiriesPage as default };
