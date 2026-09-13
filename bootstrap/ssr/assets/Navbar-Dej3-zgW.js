import { Link, router } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Bell, Check, Search } from "lucide-react";
import moment from "moment";
//#region resources/js/Components/Navbar.jsx
function Navbar({ auth, searchQuery = "" }) {
	const [query, setQuery] = useState(searchQuery);
	const [isNotifOpen, setIsNotifOpen] = useState(false);
	const notifRef = useRef(null);
	const handleSearch = (e) => {
		if (e.key === "Enter") router.get("/search", { q: query });
	};
	const markAsRead = (id = null) => {
		router.post("/notifications/mark-read", { id }, {
			preserveScroll: true,
			preserveState: true,
			onSuccess: () => {
				if (!id) setIsNotifOpen(false);
			}
		});
	};
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	return /* @__PURE__ */ jsx("header", {
		className: "sticky top-0 z-50 bg-white border-b border-[#EDEFF1]",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full px-4 sm:px-6 h-14 flex items-center justify-between",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-3",
					children: /* @__PURE__ */ jsxs(Link, {
						href: "/",
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center",
							children: /* @__PURE__ */ jsx("span", {
								className: "text-white font-black text-lg",
								children: "N"
							})
						}), /* @__PURE__ */ jsx("span", {
							className: "hidden sm:inline-block font-bold text-[22px] tracking-tight ml-2",
							children: "coachingsinsikar"
						})]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "hidden sm:block flex-1 max-w-2xl mx-8 relative",
					children: [/* @__PURE__ */ jsx("div", {
						className: "absolute inset-y-0 left-4 flex items-center pointer-events-none",
						children: /* @__PURE__ */ jsx(Search, {
							size: 20,
							className: "text-[#878A8C]"
						})
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						placeholder: "Search coachingsinsikar",
						value: query,
						onChange: (e) => setQuery(e.target.value),
						onKeyDown: handleSearch,
						className: "w-full bg-[#F6F7F8] hover:bg-white hover:border-[#0079D3] border border-transparent rounded-full py-2.5 pl-12 pr-4 text-[14px] font-medium text-[#1C1C1C] placeholder-[#878A8C] focus:outline-none focus:bg-white focus:border-[#0079D3] focus:ring-0 transition-all shadow-none"
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-4",
					children: auth?.user ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
						className: "relative",
						ref: notifRef,
						children: [/* @__PURE__ */ jsxs("button", {
							onClick: () => setIsNotifOpen(!isNotifOpen),
							className: "p-2 hover:bg-[#F6F7F8] rounded-full relative transition-colors",
							children: [/* @__PURE__ */ jsx(Bell, {
								size: 24,
								className: "text-[#1C1C1C]"
							}), auth.unread_notifications_count > 0 && /* @__PURE__ */ jsx("div", { className: "absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" })]
						}), isNotifOpen && /* @__PURE__ */ jsxs("div", {
							className: "absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-[#EDEFF1] overflow-hidden z-50",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "p-4 border-b border-[#EDEFF1] flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "font-bold text-[#1C1C1C]",
									children: "Notifications"
								}), auth.unread_notifications_count > 0 && /* @__PURE__ */ jsxs("button", {
									onClick: () => markAsRead(),
									className: "text-[12px] font-medium text-[#0079D3] hover:underline flex items-center gap-1",
									children: [/* @__PURE__ */ jsx(Check, { size: 14 }), " Mark all as read"]
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "max-h-96 overflow-y-auto",
								children: auth.notifications?.length === 0 ? /* @__PURE__ */ jsx("div", {
									className: "p-8 text-center text-[#878A8C] text-[14px]",
									children: "You have no notifications."
								}) : auth.notifications?.map((notif) => /* @__PURE__ */ jsxs("div", {
									onClick: () => {
										if (!notif.read_at) markAsRead(notif.id);
										router.visit(notif.data.url);
									},
									className: `p-4 border-b border-[#EDEFF1] flex gap-3 cursor-pointer hover:bg-[#F6F7F8] transition-colors ${!notif.read_at ? "bg-[#F0F8FF]" : ""}`,
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-gray-200",
											children: notif.data.profile_picture ? /* @__PURE__ */ jsx("img", {
												loading: "lazy",
												decoding: "async",
												fetchPriority: "low",
												src: notif.data.profile_picture,
												className: "w-full h-full object-cover"
											}) : /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-gradient-to-tr from-[#0079D3] to-[#4F46E5]" })
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex-1",
											children: [/* @__PURE__ */ jsx("p", {
												className: "text-[14px] text-[#1C1C1C] leading-snug",
												children: notif.data.message
											}), /* @__PURE__ */ jsx("p", {
												className: "text-[12px] text-[#878A8C] mt-1",
												children: moment(notif.created_at).fromNow()
											})]
										}),
										!notif.read_at && /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-[#0079D3] mt-2" })
									]
								}, notif.id))
							})]
						})]
					}), /* @__PURE__ */ jsxs(Link, {
						href: "/dashboard",
						className: "flex items-center gap-2 hover:bg-[#F6F7F8] px-2 py-1.5 rounded-full transition-colors",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-8 h-8 rounded-full bg-blue-100 overflow-hidden",
							children: auth.user.profile_picture ? /* @__PURE__ */ jsx("img", {
								loading: "lazy",
								decoding: "async",
								fetchPriority: "low",
								src: auth.user.profile_picture,
								className: "w-full h-full object-cover"
							}) : /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-gradient-to-tr from-[#0079D3] to-[#4F46E5]" })
						}), /* @__PURE__ */ jsx("span", {
							className: "font-bold text-[14px] hidden sm:block",
							children: auth.user.name
						})]
					})] }) : /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Link, {
							href: "/login",
							className: "px-5 py-2.5 rounded-full font-bold text-[14px] bg-[#F6F7F8] hover:bg-[#E2E7E9] text-[#1C1C1C] transition-colors",
							children: "Log In"
						}), /* @__PURE__ */ jsx(Link, {
							href: "/register",
							className: "px-5 py-2.5 rounded-full font-bold text-[14px] bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-colors",
							children: "Sign Up"
						})]
					})
				})
			]
		})
	});
}
//#endregion
export { Navbar as t };
