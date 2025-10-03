import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

// Controlador para subir **una sola imagen de usuario**
export const uploadUserImage = async (req, res) => {
  try {
    const files = req.files;
    if (!files || !files.length)
      return res.status(400).json({ message: "No se envió archivo." });

    const urls = [];

    for (const file of files) {
      const filePath = `users/${Date.now()}-${file.originalname}`;

      const { error } = await supabase.storage
        .from(process.env.SUPABASE_BACKET_NAME)
        .upload(filePath, file.buffer, { contentType: file.mimetype });

      if (error) throw error;

      const { data } = supabase.storage
        .from(process.env.SUPABASE_BACKET_NAME)
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
  try {
    const files = req.files;
    if (!files || !files.length)
      return res.status(400).json({ message: "No se enviaron archivos." });

    const urls = [];

    for (const file of files) {
      const filePath = `tasks/${req.user.id}/${Date.now()}-${
        file.originalname
      }`;

      const { error } = await supabase.storage
        .from(process.env.SUPABASE_BACKET_NAME)
        .upload(filePath, file.buffer, { contentType: file.mimetype });

      if (error) throw error;

      const { data } = supabase.storage
        .from(process.env.SUPABASE_BACKET_NAME)
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
          `/storage/v1/object/public/${process.env.SUPABASE_BACKET_NAME}/`
        );
        return parts.length > 1 ? parts[1] : null;
      })
      .filter(Boolean);

    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BACKET_NAME)
      .remove(filePaths);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
