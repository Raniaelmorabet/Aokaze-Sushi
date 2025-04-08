// "use client"
//
// import { useState } from "react"
// import { motion } from "framer-motion"
// import { Calendar, Clock, Users, Check } from "lucide-react"
// import { useLanguage } from "@/context/language-context"
//
// export function ReservationForm({ onClose }) {
//   const { t } = useLanguage()
//   const [step, setStep] = useState(1)
//   const [formData, setFormData] = useState({
//     date: "",
//     time: "",
//     guests: "2",
//     name: "",
//     email: "",
//     phone: "",
//     specialRequests: "",
//     tableId: null,
//     floor: "Ground Floor",
//   })
//
//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData({ ...formData, [name]: value })
//   }
//
//   const handleSubmit = (e) => {
//     e.preventDefault()
//     setStep(3)
//   }
//
//   const nextStep = () => {
//     setStep(step + 1)
//   }
//
//   const prevStep = () => {
//     setStep(step - 1)
//   }
//
//   const selectTable = (tableId) => {
//     setFormData({ ...formData, tableId })
//   }
//
//   const selectFloor = (floor) => {
//     setFormData({ ...formData, floor })
//   }
//
//   return (
//     <div>
//       {/* Progress Steps */}
//       <div className="flex justify-between mb-6">
//         <div className="flex items-center">
//           <div
//             className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-400"}`}
//           >
//             1
//           </div>
//           <div className={`h-1 w-8 ${step >= 2 ? "bg-orange-500" : "bg-gray-700"}`}></div>
//         </div>
//         <div className="flex items-center">
//           <div
//             className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-400"}`}
//           >
//             2
//           </div>
//           <div className={`h-1 w-8 ${step >= 3 ? "bg-orange-500" : "bg-gray-700"}`}></div>
//         </div>
//         <div
//           className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-400"}`}
//         >
//           3
//         </div>
//       </div>
//
//       {step === 1 && (
//         <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
//           <h4 className="text-lg font-medium mb-4">{t("reservation.steps.dateTime")}</h4>
//
//           <div className="space-y-4 mb-6">
//             <div>
//               <label className="block text-sm text-gray-400 mb-1">{t("reservation.date")}</label>
//               <div className="relative">
//                 <input
//                   type="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleChange}
//                   className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 pl-10"
//                   required
//                 />
//                 <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               </div>
//             </div>
//
//             <div>
//               <label className="block text-sm text-gray-400 mb-1">{t("reservation.time")}</label>
//               <div className="relative">
//                 <select
//                   name="time"
//                   value={formData.time}
//                   onChange={handleChange}
//                   className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 pl-10 appearance-none"
//                   required
//                 >
//                   <option value="">{t("reservation.selectTime")}</option>
//                   <option value="11:00">11:00 AM</option>
//                   <option value="12:00">12:00 PM</option>
//                   <option value="13:00">1:00 PM</option>
//                   <option value="14:00">2:00 PM</option>
//                   <option value="18:00">6:00 PM</option>
//                   <option value="19:00">7:00 PM</option>
//                   <option value="20:00">8:00 PM</option>
//                   <option value="21:00">9:00 PM</option>
//                 </select>
//                 <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               </div>
//             </div>
//
//             <div>
//               <label className="block text-sm text-gray-400 mb-1">{t("reservation.guests")}</label>
//               <div className="relative">
//                 <select
//                   name="guests"
//                   value={formData.guests}
//                   onChange={handleChange}
//                   className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 pl-10 appearance-none"
//                   required
//                 >
//                   <option value="1">1 {t("reservation.person")}</option>
//                   <option value="2">2 {t("reservation.people")}</option>
//                   <option value="3">3 {t("reservation.people")}</option>
//                   <option value="4">4 {t("reservation.people")}</option>
//                   <option value="5">5 {t("reservation.people")}</option>
//                   <option value="6">6 {t("reservation.people")}</option>
//                   <option value="7">7 {t("reservation.people")}</option>
//                   <option value="8">8 {t("reservation.people")}</option>
//                 </select>
//                 <Users size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               </div>
//             </div>
//           </div>
//
//           {/* Table Selection */}
//           <div className="mt-8">
//             <h4 className="text-lg font-medium mb-4">Select a Table</h4>
//
//             {/* Floor Selection */}
//             <div className="flex space-x-3 mb-8">
//               {["Ground Floor", "1st Floor", "2nd Floor", "Rooftop"].map((floor) => (
//                 <button
//                   key={floor}
//                   onClick={() => selectFloor(floor)}
//                   className={`px-4 py-2 rounded-lg text-sm transition-colors ${
//                     formData.floor === floor
//                       ? "bg-black text-white"
//                       : "bg-white bg-opacity-10 text-gray-400 hover:bg-opacity-15"
//                   }`}
//                 >
//                   {floor}
//                 </button>
//               ))}
//             </div>
//
//             {/* Table Layout */}
//             <div className="relative w-full mb-8">
//               {/* First row */}
//               <div className="flex justify-between mb-10">
//                 {/* Table 13 */}
//                 <div className="relative w-1/4">
//                   <div className="mx-auto w-20 h-2 bg-gray-200 bg-opacity-10 rounded mb-1"></div>
//                   <div className="flex">
//                     <div className="w-2 h-20 bg-gray-200 bg-opacity-10 rounded mr-1"></div>
//                     <button
//                       onClick={() => selectTable(13)}
//                       className={`w-20 h-20 rounded-lg flex items-center justify-center text-xl font-medium ${
//                         formData.tableId === 13
//                           ? "bg-teal-200 text-black"
//                           : "bg-gray-200 bg-opacity-10 text-gray-400 hover:bg-opacity-15"
//                       }`}
//                     >
//                       13
//                       {formData.tableId === 13 && <Check size={18} className="absolute top-2 right-2" />}
//                     </button>
//                     <div className="w-2 h-20 bg-gray-200 bg-opacity-10 rounded ml-1"></div>
//                   </div>
//                   <div className="mx-auto w-20 h-2 bg-gray-200 bg-opacity-10 rounded mt-1"></div>
//                 </div>
//
//                 {/* Table 14 */}
//                 <div className="relative w-2/4">
//                   <div className="mx-auto w-48 h-2 bg-gray-200 bg-opacity-10 rounded mb-1"></div>
//                   <div className="flex">
//                     <div className="w-2 h-20 bg-gray-200 bg-opacity-10 rounded mr-1"></div>
//                     <button
//                       onClick={() => selectTable(14)}
//                       className={`w-48 h-20 rounded-lg flex items-center justify-center text-xl font-medium ${
//                         formData.tableId === 14
//                           ? "bg-teal-200 text-black"
//                           : "bg-gray-200 bg-opacity-10 text-gray-400 hover:bg-opacity-15"
//                       }`}
//                     >
//                       14
//                       {formData.tableId === 14 && <Check size={18} className="absolute top-2 right-2" />}
//                     </button>
//                     <div className="w-2 h-20 bg-gray-200 bg-opacity-10 rounded ml-1"></div>
//                   </div>
//                   <div className="mx-auto w-48 h-2 bg-gray-200 bg-opacity-10 rounded mt-1"></div>
//                 </div>
//               </div>
//
//               {/* Second row */}
//               <div className="flex justify-between mb-10">
//                 {/* Table 15 */}
//                 <div className="relative w-1/4">
//                   <div className="mx-auto w-20 h-2 bg-gray-200 bg-opacity-10 rounded mb-1"></div>
//                   <div className="flex">
//                     <div className="w-2 h-20 bg-gray-200 bg-opacity-10 rounded mr-1"></div>
//                     <button
//                       onClick={() => selectTable(15)}
//                       className={`w-20 h-20 rounded-lg flex items-center justify-center text-xl font-medium ${
//                         formData.tableId === 15
//                           ? "bg-teal-200 text-black"
//                           : "bg-gray-200 bg-opacity-10 text-gray-400 hover:bg-opacity-15"
//                       }`}
//                     >
//                       15
//                       {formData.tableId === 15 && <Check size={18} className="absolute top-2 right-2" />}
//                     </button>
//                     <div className="w-2 h-20 bg-gray-200 bg-opacity-10 rounded ml-1"></div>
//                   </div>
//                   <div className="mx-auto w-20 h-2 bg-gray-200 bg-opacity-10 rounded mt-1"></div>
//                 </div>
//
//                 {/* Table 16 */}
//                 <div className="relative w-1/4">
//                   <div className="mx-auto w-20 h-2 bg-teal-200 bg-opacity-50 rounded mb-1"></div>
//                   <div className="flex">
//                     <div className="w-2 h-20 bg-teal-200 bg-opacity-50 rounded mr-1"></div>
//                     <button
//                       onClick={() => selectTable(16)}
//                       className={`w-20 h-20 rounded-lg flex items-center justify-center text-xl font-medium ${
//                         formData.tableId === 16
//                           ? "bg-teal-200 text-black"
//                           : "bg-gray-200 bg-opacity-10 text-gray-400 hover:bg-opacity-15"
//                       }`}
//                     >
//                       16
//                       {formData.tableId === 16 && <Check size={18} className="absolute top-2 right-2" />}
//                     </button>
//                     <div className="w-2 h-20 bg-teal-200 bg-opacity-50 rounded ml-1"></div>
//                   </div>
//                   <div className="mx-auto w-20 h-2 bg-teal-200 bg-opacity-50 rounded mt-1"></div>
//                 </div>
//
//                 {/* Table 17 */}
//                 <div className="relative w-1/4">
//                   <div className="mx-auto w-20 h-2 bg-gray-200 bg-opacity-10 rounded mb-1"></div>
//                   <div className="flex">
//                     <div className="w-2 h-20 bg-gray-200 bg-opacity-10 rounded mr-1"></div>
//                     <button
//                       onClick={() => selectTable(17)}
//                       className={`w-20 h-20 rounded-lg flex items-center justify-center text-xl font-medium ${
//                         formData.tableId === 17
//                           ? "bg-teal-200 text-black"
//                           : "bg-gray-200 bg-opacity-10 text-gray-400 hover:bg-opacity-15"
//                       }`}
//                     >
//                       17
//                       {formData.tableId === 17 && <Check size={18} className="absolute top-2 right-2" />}
//                     </button>
//                     <div className="w-2 h-20 bg-gray-200 bg-opacity-10 rounded ml-1"></div>
//                   </div>
//                   <div className="mx-auto w-20 h-2 bg-gray-200 bg-opacity-10 rounded mt-1"></div>
//                 </div>
//               </div>
//
//               {/* Third row */}
//               <div className="flex justify-between mb-10">
//                 {/* Table 18 */}
//                 <div className="relative w-5/12">
//                   <div className="flex justify-between mb-1">
//                     <div className="w-12 h-2 bg-gray-200 bg-opacity-10 rounded"></div>
//                     <div className="w-12 h-2 bg-gray-200 bg-opacity-10 rounded"></div>
//                     <div className="w-12 h-2 bg-gray-200 bg-opacity-10 rounded"></div>
//                   </div>
//                   <div className="flex">
//                     <div className="w-2 h-20 bg-gray-200 bg-opacity-10 rounded mr-1"></div>
//                     <button
//                       onClick={() => selectTable(18)}
//                       className={`w-full h-20 rounded-lg flex items-center justify-center text-xl font-medium ${
//                         formData.tableId === 18
//                           ? "bg-teal-200 text-black"
//                           : "bg-gray-200 bg-opacity-10 text-gray-400 hover:bg-opacity-15"
//                       }`}
//                     >
//                       18
//                       {formData.tableId === 18 && <Check size={18} className="absolute top-2 right-2" />}
//                     </button>
//                     <div className="w-2 h-20 bg-gray-200 bg-opacity-10 rounded ml-1"></div>
//                   </div>
//                   <div className="flex justify-between mt-1">
//                     <div className="w-12 h-2 bg-gray-200 bg-opacity-10 rounded"></div>
//                     <div className="w-12 h-2 bg-gray-200 bg-opacity-10 rounded"></div>
//                     <div className="w-12 h-2 bg-gray-200 bg-opacity-10 rounded"></div>
//                   </div>
//                 </div>
//
//                 {/* Table 19 */}
//                 <div className="relative w-5/12">
//                   <div className="flex justify-between mb-1">
//                     <div className="w-12 h-2 bg-gray-200 bg-opacity-10 rounded"></div>
//                     <div className="w-12 h-2 bg-gray-200 bg-opacity-10 rounded"></div>
//                     <div className="w-12 h-2 bg-gray-200 bg-opacity-10 rounded"></div>
//                   </div>
//                   <div className="flex">
//                     <div className="w-2 h-20 bg-gray-200 bg-opacity-10 rounded mr-1"></div>
//                     <button
//                       onClick={() => selectTable(19)}
//                       className={`w-full h-20 rounded-lg flex items-center justify-center text-xl font-medium ${
//                         formData.tableId === 19
//                           ? "bg-teal-200 text-black"
//                           : "bg-gray-200 bg-opacity-10 text-gray-400 hover:bg-opacity-15"
//                       }`}
//                     >
//                       19
//                       {formData.tableId === 19 && <Check size={18} className="absolute top-2 right-2" />}
//                     </button>
//                     <div className="w-2 h-20 bg-gray-200 bg-opacity-10 rounded ml-1"></div>
//                   </div>
//                   <div className="flex justify-between mt-1">
//                     <div className="w-12 h-2 bg-gray-200 bg-opacity-10 rounded"></div>
//                     <div className="w-12 h-2 bg-gray-200 bg-opacity-10 rounded"></div>
//                     <div className="w-12 h-2 bg-gray-200 bg-opacity-10 rounded"></div>
//                   </div>
//                 </div>
//               </div>
//
//               {/* Fourth row */}
//               <div className="flex justify-between">
//                 {/* Table 20 */}
//                 <div className="relative w-5/12">
//                   <div className="flex justify-between mb-1">
//                     <div className="w-12 h-2 bg-gray-200 bg-opacity-10 rounded"></div>
//                     <div className="w-12 h-2 bg-gray-200 bg-opacity-10 rounded"></div>
//                     <div className="w-12 h-2 bg-gray-200 bg-opacity-10 rounded"></div>
//                   </div>
//                   <div className="flex">
//                     <div className="w-2 h-20 bg-gray-200 bg-opacity-10 rounded mr-1"></div>
//                     <button
//                       onClick={() => selectTable(20)}
//                       className={`w-full h-20 rounded-lg flex items-center justify-center text-xl font-medium ${
//                         formData.tableId === 20
//                           ? "bg-teal-200 text-black"
//                           : "bg-gray-200 bg-opacity-10 text-gray-400 hover:bg-opacity-15"
//                       }`}
//                     >
//                       20
//                       {formData.tableId === 20 && <Check size={18} className="absolute top-2 right-2" />}
//                     </button>
//                     <div className="w-2 h-20 bg-gray-200 bg-opacity-10 rounded ml-1"></div>
//                   </div>
//                   <div className="flex justify-between mt-1">
//                     <div className="w-12 h-2 bg-gray-200 bg-opacity-10 rounded"></div>
//                     <div className="w-12 h-2 bg-gray-200 bg-opacity-10 rounded"></div>
//                     <div className="w-12 h-2 bg-gray-200 bg-opacity-10 rounded"></div>
//                   </div>
//                 </div>
//
//                 {/* Table 21 */}
//                 <div className="relative w-1/4">
//                   <div className="mx-auto w-20 h-2 bg-gray-200 bg-opacity-10 rounded mb-1"></div>
//                   <div className="flex">
//                     <div className="w-2 h-20 bg-gray-200 bg-opacity-10 rounded mr-1"></div>
//                     <button
//                       onClick={() => selectTable(21)}
//                       className={`w-20 h-20 rounded-lg flex items-center justify-center text-xl font-medium ${
//                         formData.tableId === 21
//                           ? "bg-teal-200 text-black"
//                           : "bg-gray-200 bg-opacity-10 text-gray-400 hover:bg-opacity-15"
//                       }`}
//                     >
//                       21
//                       {formData.tableId === 21 && <Check size={18} className="absolute top-2 right-2" />}
//                     </button>
//                     <div className="w-2 h-20 bg-gray-200 bg-opacity-10 rounded ml-1"></div>
//                   </div>
//                   <div className="mx-auto w-20 h-2 bg-gray-200 bg-opacity-10 rounded mt-1"></div>
//                 </div>
//               </div>
//             </div>
//
//             {/* Reserve Button */}
//             <button
//               onClick={nextStep}
//               disabled={!formData.date || !formData.time || !formData.tableId}
//               className="w-full bg-black text-white py-4 rounded-full font-medium transition-colors hover:bg-gray-900 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
//             >
//               Reserve Table
//             </button>
//           </div>
//         </motion.div>
//       )}
//
//       {step === 2 && (
//         <motion.form
//           onSubmit={handleSubmit}
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           exit={{ opacity: 0, x: -20 }}
//         >
//           <h4 className="text-lg font-medium mb-4">{t("reservation.steps.info")}</h4>
//
//           <div className="space-y-4 mb-6">
//             <div>
//               <label className="block text-sm text-gray-400 mb-1">{t("reservation.name")}</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
//                 required
//               />
//             </div>
//
//             <div>
//               <label className="block text-sm text-gray-400 mb-1">{t("reservation.email")}</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
//                 required
//               />
//             </div>
//
//             <div>
//               <label className="block text-sm text-gray-400 mb-1">{t("reservation.phone")}</label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
//                 required
//               />
//             </div>
//
//             <div>
//               <label className="block text-sm text-gray-400 mb-1">{t("reservation.specialRequests")}</label>
//               <textarea
//                 name="specialRequests"
//                 value={formData.specialRequests}
//                 onChange={handleChange}
//                 className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 min-h-[80px]"
//                 placeholder="Any special requirements or notes..."
//               ></textarea>
//             </div>
//           </div>
//
//           <div className="flex justify-between">
//             <button
//               type="button"
//               onClick={prevStep}
//               className="bg-[#2a2a2a] hover:bg-[#333] text-white px-6 py-2 rounded-lg transition-colors"
//             >
//               {t("reservation.back")}
//             </button>
//             <button
//               type="submit"
//               className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
//             >
//               {t("reservation.reserve")}
//             </button>
//           </div>
//         </motion.form>
//       )}
//
//       {step === 3 && (
//         <motion.div
//           className="text-center py-6"
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//         >
//           <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
//             <Check size={32} />
//           </div>
//           <h4 className="text-xl font-bold mb-2">{t("reservation.steps.confirmation")}</h4>
//           <p className="text-gray-400 mb-6">{t("reservation.success")}</p>
//           <div className="bg-[#2a2a2a] rounded-lg p-4 mb-6">
//             <div className="flex justify-between mb-2">
//               <span className="text-gray-400">{t("reservation.details.date")}</span>
//               <span>{formData.date}</span>
//             </div>
//             <div className="flex justify-between mb-2">
//               <span className="text-gray-400">{t("reservation.details.time")}</span>
//               <span>{formData.time}</span>
//             </div>
//             <div className="flex justify-between mb-2">
//               <span className="text-gray-400">{t("reservation.details.guests")}</span>
//               <span>{formData.guests}</span>
//             </div>
//             <div className="flex justify-between mb-2">
//               <span className="text-gray-400">Floor:</span>
//               <span>{formData.floor}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-400">Table:</span>
//               <span>#{formData.tableId}</span>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
//           >
//             {t("reservation.done")}
//           </button>
//         </motion.div>
//       )}
//     </div>
//   )
// }
