import { Head, Link, router } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import "react";
import { ArrowLeft, Check, Shield, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
//#region resources/js/Pages/Community/ModQueue.jsx
dayjs.extend(relativeTime);
function ModQueue({ auth, community, reports }) {
	const handleApprove = (reportId) => {
		router.post(route("reports.approve", reportId), {}, { preserveScroll: true });
	};
	const handleRemove = (reportId) => {
		router.post(route("reports.remove", reportId), {}, { preserveScroll: true });
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#DAE0E6] text-[#1C1C1C] font-sans pb-20 pt-14",
		children: [
			/* @__PURE__ */ jsx(Head, { title: `Mod Queue - r/${community.name}` }),
			/* @__PURE__ */ jsx("header", {
				className: "fixed top-0 z-50 w-full bg-white border-b border-[#EDEFF1]",
				children: /* @__PURE__ */ jsx("div", {
					className: "w-full px-4 sm:px-6 h-14 flex items-center justify-between",
					children: /* @__PURE__ */ jsxs(Link, {
						href: "/feed",
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center",
							children: /* @__PURE__ */ jsx("span", {
								className: "text-white font-black text-lg",
								children: "N"
							})
						}), /* @__PURE__ */ jsx("span", {
							className: "font-extrabold text-xl tracking-tight hidden sm:block",
							children: "coachinginsikar"
						})]
					})
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "w-full max-w-4xl mx-auto px-4 sm:px-6 mt-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4 mb-6",
					children: [/* @__PURE__ */ jsx(Link, {
						href: `/community/${community.name}`,
						className: "w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-[#F6F7F8] transition-colors",
						children: /* @__PURE__ */ jsx(ArrowLeft, {
							size: 20,
							className: "text-[#878A8C]"
						})
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h1", {
						className: "text-[22px] font-bold text-[#1C1C1C] flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Shield, {
							size: 24,
							className: "text-[#0079D3]"
						}), "Mod Queue"]
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-[14px] text-[#787C7E]",
						children: ["r/", community.name]
					})] })]
				}), /* @__PURE__ */ jsx("div", {
					className: "bg-white rounded-md border border-[#EDEFF1] overflow-hidden",
					children: reports.length === 0 ? /* @__PURE__ */ jsxs("div", {
						className: "p-10 text-center flex flex-col items-center justify-center text-[#878A8C]",
						children: [
							/* @__PURE__ */ jsx(Shield, {
								size: 48,
								className: "mb-4 opacity-50"
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "text-[18px] font-bold text-[#1C1C1C] mb-2",
								children: "The queue is clean!"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-[14px]",
								children: "No pending reports to review."
							})
						]
					}) : /* @__PURE__ */ jsx("div", {
						className: "divide-y divide-[#EDEFF1]",
						children: reports.map((report) => /* @__PURE__ */ jsxs("div", {
							className: "p-4 hover:bg-[#F8F9FA] transition-colors",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 text-[12px] text-[#787C7E] mb-2",
									children: [
										/* @__PURE__ */ jsxs("span", {
											className: "font-bold text-[#FF4500]",
											children: ["Reported for: ", report.reason]
										}),
										/* @__PURE__ */ jsx("span", { children: "•" }),
										/* @__PURE__ */ jsxs("span", { children: ["By u/", report.user.username] }),
										/* @__PURE__ */ jsx("span", { children: "•" }),
										/* @__PURE__ */ jsx("span", { children: dayjs(report.created_at).fromNow() })
									]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "bg-[#F6F7F8] border border-[#EDEFF1] p-3 rounded-md mb-3",
									children: report.reportable_type.includes("Post") ? /* @__PURE__ */ jsxs(Fragment, { children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2 text-[12px] text-[#787C7E] mb-1",
											children: [
												/* @__PURE__ */ jsx("span", {
													className: "font-bold",
													children: "Post"
												}),
												" by u/",
												report.reportable?.author?.username || "deleted"
											]
										}),
										/* @__PURE__ */ jsx("h3", {
											className: "font-medium text-[16px] mb-1",
											children: report.reportable?.title
										}),
										report.reportable?.content && /* @__PURE__ */ jsx("div", {
											className: "text-[14px] text-[#1C1C1C] line-clamp-3",
											dangerouslySetInnerHTML: { __html: report.reportable.content }
										})
									] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 text-[12px] text-[#787C7E] mb-1",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "font-bold",
												children: "Comment"
											}),
											" by u/",
											report.reportable?.author?.username || "deleted"
										]
									}), /* @__PURE__ */ jsx("div", {
										className: "text-[14px] text-[#1C1C1C]",
										children: report.reportable?.content
									})] })
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsxs("button", {
										onClick: () => handleApprove(report.id),
										className: "flex items-center gap-1.5 px-4 py-1.5 font-bold text-[14px] bg-[#E2E7E9] hover:bg-[#D4DADB] text-[#1C1C1C] rounded-full transition-colors border-0 outline-none focus:outline-none focus:ring-0",
										children: [/* @__PURE__ */ jsx(Check, { size: 16 }), " Approve (Ignore Report)"]
									}), /* @__PURE__ */ jsxs("button", {
										onClick: () => handleRemove(report.id),
										className: "flex items-center gap-1.5 px-4 py-1.5 font-bold text-[14px] bg-red-100 hover:bg-red-200 text-red-700 rounded-full transition-colors border-0 outline-none focus:outline-none focus:ring-0",
										children: [/* @__PURE__ */ jsx(Trash2, { size: 16 }), " Remove Content"]
									})]
								})
							]
						}, report.id))
					})
				})]
			})
		]
	});
}
//#endregion
export { ModQueue as default };
