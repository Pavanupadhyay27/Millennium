"use client";

import React, { useState } from "react";
import {
  Folder,
  FolderOpen,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronDown,
  Sparkles,
  X,
  Upload,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Initial Mock Categories
const INITIAL_CATEGORIES = [
  { id: "c1", name: "Seating", slug: "seating", parentId: null, image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=100" },
  { id: "c1-1", name: "Lounge Chairs", slug: "lounge-chairs", parentId: "c1", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=100" },
  { id: "c1-2", name: "Boucle Sofas", slug: "boucle-sofas", parentId: "c1", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100" },
  { id: "c2", name: "Tables", slug: "tables", parentId: null, image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=100" },
  { id: "c2-1", name: "Coffee Tables", slug: "coffee-tables", parentId: "c2", image: "https://images.unsplash.com/photo-1551215934-37d0573d6622?w=100" },
  { id: "c2-2", name: "Writing Desks", slug: "writing-desks", parentId: "c2", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=100" },
  { id: "c3", name: "Storage", slug: "storage", parentId: null, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=100" },
  { id: "c3-1", name: "Bookshelves", slug: "bookshelves", parentId: "c3", image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=100" },
  { id: "c4", name: "Decorations", slug: "decorations", parentId: null, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100" },
];

export default function CategoryTreePage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [expandedNodes, setExpandedNodes] = useState<string[]>(["c1", "c2", "c3"]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    slug: "",
    parentId: "" as string | null,
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=100",
  });

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) =>
      prev.includes(id) ? prev.filter((nodeId) => nodeId !== id) : [...prev, id]
    );
  };

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  const handleOpenAdd = (parentId: string | null = null) => {
    setFormData({
      id: `c-${Date.now()}`,
      name: "",
      slug: "",
      parentId: parentId || "",
      image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=100",
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEdit = (cat: typeof INITIAL_CATEGORIES[0]) => {
    setFormData({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId || "",
      image: cat.image,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    // Remove this category and re-parent its children to its own parent (if any) or null
    const matched = categories.find((c) => c.id === id);
    if (!matched) return;

    setCategories((prev) =>
      prev
        .filter((c) => c.id !== id)
        .map((c) => (c.parentId === id ? { ...c, parentId: matched.parentId } : c))
    );
    showToast(`Category '${matched.name}' deleted.`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanParentId = formData.parentId === "" ? null : formData.parentId;
    const finalData = { ...formData, parentId: cleanParentId };

    if (isEditing) {
      setCategories((prev) => prev.map((c) => (c.id === formData.id ? finalData : c)));
      showToast("Category updated.");
    } else {
      setCategories((prev) => [...prev, finalData]);
      showToast("New category created.");
    }
    setShowModal(false);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Group Categories by Parent (Roots vs Children)
  const rootCategories = categories.filter((c) => c.parentId === null);
  const getSubcategories = (parentId: string) => categories.filter((c) => c.parentId === parentId);

  return (
    <div className="flex flex-col gap-8">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-24 right-8 z-50 bg-accent-teal text-white rounded-2xl px-6 py-4 text-xs font-bold shadow-warm-lg flex items-center gap-2"
          >
            <FolderOpen className="w-4 h-4" /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1F1B16] dark:text-[#F7F3EC] mb-2">
            Catalog Categories
          </h1>
          <p className="text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 text-xs font-semibold">
            Define subcategories, parent nodes, generate custom URL path slugs, and upload category tiles.
          </p>
        </div>

        <button
          onClick={() => handleOpenAdd(null)}
          className="bg-accent-teal text-white font-bold px-6 py-3.5 rounded-full text-xs flex items-center gap-2 hover:bg-accent-teal/90 hover:shadow-warm-md transition-all duration-300"
        >
          <Plus className="w-4 h-4" /> Add Root Category
        </button>
      </div>

      {/* Main Grid: Category Tree list */}
      <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-6 md:p-8 shadow-sm max-w-4xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
          <h3 className="font-serif text-xl font-bold text-[#1F1B16] dark:text-[#F7F3EC]">
            Taxonomy Tree Structure
          </h3>
          <span className="text-[10px] font-extrabold text-accent-teal uppercase tracking-widest bg-accent-teal/10 px-3 py-1 rounded-full">
            {rootCategories.length} Main Branches
          </span>
        </div>

        {/* Tree List */}
        <div className="flex flex-col gap-4">
          {rootCategories.map((root) => {
            const subs = getSubcategories(root.id);
            const isExpanded = expandedNodes.includes(root.id);
            const hasSubs = subs.length > 0;

            return (
              <div key={root.id} className="border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-4 bg-[#FAF7F2] dark:bg-[#12100E] shadow-sm">
                {/* Root Row */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Toggle expand */}
                    <button
                      onClick={() => toggleNode(root.id)}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 text-[#1F1B16] dark:text-[#F7F3EC] ${
                        !hasSubs ? "opacity-30 pointer-events-none" : "hover:border-accent-teal"
                      }`}
                    >
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-accent-teal/10 border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={root.image} alt={root.name} className="w-full h-full object-cover" />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[#1F1B16] dark:text-[#F7F3EC]">{root.name}</h4>
                      <p className="font-mono text-[10px] text-accent-teal font-extrabold">/{root.slug}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenAdd(root.id)}
                      className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold px-3.5 py-1.5 rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm transition-all"
                      title="Add sub-category"
                    >
                      <Plus className="w-3.5 h-3.5" /> Subcategory
                    </button>
                    <button
                      onClick={() => handleOpenEdit(root)}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 flex items-center justify-center text-[#1F1B16] dark:text-[#F7F3EC] hover:border-accent-teal transition-all"
                      title="Rename/Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(root.id)}
                      className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-all"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subcategories (Indented Tree Node) */}
                <AnimatePresence>
                  {isExpanded && hasSubs && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-10 mt-3 pt-3 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 flex flex-col gap-2.5 overflow-hidden"
                    >
                      {subs.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between gap-4 py-2 px-3 bg-white dark:bg-[#1C1814] rounded-xl border border-[#1F1B16]/5 dark:border-[#F7F3EC]/10"
                        >
                          <div className="flex items-center gap-3">
                            <Folder className="w-4 h-4 text-accent-teal shrink-0" />
                            <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-[#1F1B16] dark:text-[#F7F3EC]">{sub.name}</h5>
                              <p className="font-mono text-[9px] text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 leading-none">/{sub.slug}</p>
                            </div>
                          </div>

                          {/* Sub actions */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(sub)}
                              className="w-7 h-7 rounded-lg bg-[#FAF7F2] dark:bg-[#12100E] flex items-center justify-center text-[#1F1B16] dark:text-[#F7F3EC] hover:text-accent-teal transition-all"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDelete(sub.id)}
                              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-50 text-red-500"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* CATEGORY FORM MODAL */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black z-50"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 m-auto w-full max-w-md h-fit bg-white border border-[#1F1B16]/10 rounded-[32px] p-8 z-50 shadow-warm-xl"
            >
              <div className="flex justify-between items-center border-b border-[#1F1B16]/5 pb-4 mb-6">
                <h3 className="font-serif text-xl font-bold text-[#1F1B16]">
                  {isEditing ? "Edit Category Node" : "Create Category Node"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-[#1F1B16]/5 flex items-center justify-center hover:bg-[#1F1B16]/15"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Lounge Seats"
                    className="border border-[#1F1B16]/10 rounded-full px-5 py-3 text-xs bg-[#F7F3EC] text-[#1F1B16] focus:outline-none focus:border-accent-teal"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="e.g. lounge-seats"
                    className="border border-[#1F1B16]/10 rounded-full px-5 py-3 text-xs bg-[#F7F3EC] text-[#1F1B16] focus:outline-none focus:border-accent-teal"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50">Parent Category</label>
                  <select
                    value={formData.parentId || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, parentId: e.target.value || null }))}
                    className="border border-[#1F1B16]/10 rounded-full px-5 py-3 text-xs bg-[#F7F3EC] text-[#1F1B16] focus:outline-none cursor-pointer"
                  >
                    <option value="">[No Parent - Root Category]</option>
                    {categories
                      .filter((c) => c.parentId === null && c.id !== formData.id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Upload Image category tile */}
                <div className="mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F1B16]/50 block mb-2">Category Tile Image</span>
                  <div className="border border-dashed border-[#1F1B16]/20 rounded-2xl p-4 text-center bg-[#F7F3EC]/50 hover:bg-[#F7F3EC] transition-colors cursor-pointer flex items-center justify-center gap-2 group">
                    <Upload className="w-4 h-4 text-[#1F1B16]/40 group-hover:text-accent-teal" />
                    <span className="font-bold text-[10px] text-[#1F1B16]">Upload image</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold py-3.5 rounded-full mt-4 text-xs shadow-warm-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Save Category Configuration
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
