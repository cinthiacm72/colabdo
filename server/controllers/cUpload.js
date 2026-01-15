import { createClient } from "@supabase/supabase-js";
import { sanitizeFileName } from "../utils/sanitizeFileName.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

if (process.env.NODE_ENV === "development") {
  const checkBuckets = async () => {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error("❌ Error listando buckets:", error.message);
    } else {
      console.log(
        "✅ Buckets disponibles:",
        data.map((b) => b.name)
      );
    }
  };
  checkBuckets();
}

// Controlador para subir **una sola imagen de usuario**
export const uploadUserImage = async (req, res) => {
  try {
    const files = req.files;
    if (!files || !files.length)
      return res.status(400).json({ message: "No se envió archivo." });

    const urls = [];

    for (const file of files) {
      const safeName = sanitizeFileName(file.originalname);
      const filePath = `users/${Date.now()}-${safeName}`;

      const { error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET_NAME)
        .upload(filePath, file.buffer, { contentType: file.mimetype });

      if (error) throw error;

      const { data } = supabase.storage
        .from(process.env.SUPABASE_BUCKET_NAME)
        .getPublicUrl(filePath);

      urls.push(data.publicUrl);
    }

    res.json({ success: true, urls });
  } catch (err) {
    console.error("Error uploadUserImage:", err);
    res.status(500).json({ message: err.message });
  }
};

// Controlador para subir **múltiples imágenes en tareas**
export const uploadTaskImages = async (req, res) => {
  console.log("req.user:", req.user);
  try {
    const files = req.files;
    if (!files || !files.length)
      return res.status(400).json({ message: "No se enviaron archivos." });

    const urls = [];

    for (const file of files) {
      const safeName = sanitizeFileName(file.originalname);
      const filePath = `tasks/${req.user._id}/${Date.now()}-${safeName}`;

      const { error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET_NAME)
        .upload(filePath, file.buffer, { contentType: file.mimetype });

      if (error) throw error;

      const { data } = supabase.storage
        .from(process.env.SUPABASE_BUCKET_NAME)
        .getPublicUrl(filePath);
      urls.push(data.publicUrl);
    }

    res.json({ success: true, urls });
  } catch (err) {
    console.error("Error uploadTaskImages:", err);
    res.status(500).json({ message: err.message });
  }
};

// Eliminar archivos (en caso de fallo al crear la tarea)
export const deleteFiles = async (req, res) => {
  try {
    const { files } = req.body; // array de URLs
    if (!files || files.length === 0) return res.json({ success: true });

    const filePaths = files
      .map((url) => {
        const urlObj = new URL(url);
        const parts = urlObj.pathname.split(
          `/storage/v1/object/public/${process.env.SUPABASE_BUCKET_NAME}/`
        );
        return parts.length > 1 ? parts[1] : null;
      })
      .filter(Boolean);

    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .remove(filePaths);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
