export const DEMO_FILES = [
  {
    id: '1',
    name: 'legacy_processor.py',
    language: 'python',
    path: '/src/legacy_processor.py',
    content: `def Do_Something(x, y):
    # Old style code
    res = x + y
    if res > 10:
        print("Big number")
    return res

class data_handler:
    def __init__(self):
        self.db_conn = None
    
    def connectDB(self, str):
        print("Connecting to " + str)
`
  },
  {
    id: '2',
    name: 'utils.js',
    language: 'javascript',
    path: '/src/utils.js',
    content: `function calcDate(d) {
  var now = new Date();
  var diff = now - d;
  return diff;
}

module.exports = { calcDate };`
  }
];

export const GOAL_OPTIONS = [
  { value: 'clean_code', label: 'Tối ưu hóa & Làm sạch code (Clean Code)' },
  { value: 'modernize', label: 'Hiện đại hóa (Modernize Stack)' },
  { value: 'architecture', label: 'Tái cấu trúc kiến trúc (Refactor Architecture)' },
  { value: 'translate', label: 'Chuyển đổi ngôn ngữ (Translate Language)' },
  { value: 'security', label: 'Vá lỗi bảo mật (Security Hardening)' }
];

export const LANGUAGE_OPTIONS = [
  { value: 'keep', label: 'Giữ nguyên (Như code gốc)' },
  { value: 'python', label: 'Python (Modern 3.10+)' },
  { value: 'typescript', label: 'TypeScript (Strict Mode)' },
  { value: 'go', label: 'Golang (Go 1.20+)' },
  { value: 'rust', label: 'Rust (2021 Edition)' },
  { value: 'java', label: 'Java (Spring Boot 3)' }
];

export const ARCHITECTURE_OPTIONS = [
  { value: 'keep', label: 'Giữ nguyên cấu trúc' },
  { value: 'modular', label: 'Modular Monolith' },
  { value: 'microservices', label: 'Microservices (Tách file nhỏ)' },
  { value: 'clean_arch', label: 'Clean Architecture (Domain/Data/UI)' },
  { value: 'functional', label: 'Functional Programming Style' }
];

export const NAMING_OPTIONS = [
  { value: 'standard', label: 'Theo chuẩn ngôn ngữ (PEP8, Airbnb...)' },
  { value: 'camelCase', label: 'camelCase (javaScript style)' },
  { value: 'snake_case', label: 'snake_case (python style)' },
  { value: 'PascalCase', label: 'PascalCase (C#/Go types)' }
];

export const DOCS_OPTIONS = [
  { value: 'minimal', label: 'Tối thiểu (Chỉ hàm chính)' },
  { value: 'detailed', label: 'Chi tiết (Docstring đầy đủ)' },
  { value: 'readme', label: 'Tạo thêm README.md hướng dẫn' },
  { value: 'none', label: 'Không cần comment' }
];
