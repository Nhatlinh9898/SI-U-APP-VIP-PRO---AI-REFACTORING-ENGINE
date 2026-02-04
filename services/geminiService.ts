import { GoogleGenAI } from "@google/genai";
import { FileNode, RefactoringConfig } from "../types";

const getSystemPrompt = (config: RefactoringConfig) => {
  return `
Bạn là một SIÊU TRÍ TUỆ NHÂN TẠO kiêm CHUYÊN GIA DEVOPS (AI Refactoring & Build Engine).
Nhiệm vụ của bạn là đọc các file code đầu vào, hiểu logic, tái cấu trúc và ĐÓNG GÓI dự án hoàn chỉnh dựa trên cấu hình:

1. **Mục tiêu:** ${config.targetGoal}
2. **Ngôn ngữ đích:** ${config.targetLanguage}
3. **Kiến trúc:** ${config.architectureStyle}
4. **Quy tắc đặt tên:** ${config.namingConvention}
5. **Tài liệu hóa:** ${config.documentationLevel}
6. **Yêu cầu thêm:** ${config.additionalPrompt}

NHIỆM VỤ BẮT BUỘC (CRITICAL):
- Tái cấu trúc code sao cho CHẠY ĐƯỢC (Functional).
- Sắp xếp cấu trúc thư mục chuẩn (Best Practice Folder Structure).
- **TỰ ĐỘNG TẠO FILE DEPENDENCY:** Bạn PHẢI tạo thêm các file cấu hình cần thiết để cài đặt và chạy dự án (Ví dụ: 'package.json' cho Node/TS, 'requirements.txt' hoặc 'pyproject.toml' cho Python, 'go.mod' cho Go, 'pom.xml' cho Java...).
- Tạo file 'README.md' hướng dẫn cách cài đặt và chạy.

HÃY TRẢ VỀ KẾT QUẢ DƯỚI DẠNG JSON THUẦN TÚY (Không Markdown).
Cấu trúc JSON mong đợi:
{
  "summary": "Tóm tắt ngắn gọn những thay đổi chính và các file cấu hình đã thêm (Tiếng Việt)",
  "logs": ["Dòng log 1: Đã đọc file X...", "Dòng log 2: Refactoring logic...", "Dòng log 3: Tạo file requirements.txt..."],
  "files": [
    {
      "id": "new_1",
      "name": "tên_file.ext",
      "path": "src/controllers/user_controller.py", 
      "language": "python",
      "content": "Nội dung code đầy đủ..."
    },
    {
      "id": "config_1",
      "name": "requirements.txt",
      "path": "requirements.txt",
      "language": "plaintext",
      "content": "flask==3.0.0\nnumpy==1.26.0..."
    }
  ]
}

LƯU Ý: Đường dẫn 'path' không cần bắt đầu bằng dấu '/'. Hãy tổ chức thư mục hợp lý.
`;
};

export const refactorCode = async (
  files: FileNode[],
  config: RefactoringConfig
): Promise<any> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key chưa được cấu hình.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Construct the user message with all file contents
    let fileContentStr = "DANH SÁCH FILE ĐẦU VÀO:\n";
    files.forEach((f, idx) => {
      fileContentStr += `--- FILE ${idx + 1}: ${f.path} (${f.language}) ---\n${f.content}\n\n`;
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        {
            role: 'user',
            parts: [
                { text: getSystemPrompt(config) },
                { text: fileContentStr }
            ]
        }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("Không nhận được phản hồi từ AI.");

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON", text);
      throw new Error("Lỗi định dạng dữ liệu từ AI.");
    }

  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};