# وثيقة الافتراضات والتفاصيل التعليمية (ASSUMPTIONS.md)

تحتوي هذه الوثيقة على كافة الافتراضات التوثيقية والقرارات التقنية والتربوية المتبعة في منصة «مذكرتي»، وفق التوجيه الصارم بألا تُعرض أي معلومة غير موثقة كحقيقة رسمية.

---

## 1. الهيكل التربوي للطور المتوسط الجزائري (Middle School English - Algeria)
- **المستويات الرسمية:**
  - 1AM: الأولى متوسط (First Year Middle School)
  - 2AM: الثانية متوسط (Second Year Middle School)
  - 3AM: الثالثة متوسط (Third Year Middle School)
  - 4AM: الرابعة متوسط (Fourth Year Middle School - BEM Exam Year)
- **المصطلحات الرسمية المعتمدة في مناهج وزارة التربية الوطنية:**
  - Sequence (المقطع التعلمي)
  - Session (الحصة التعليمية)
  - Frameworks: PPU (Presentation, Practice, Use), PDP (Pre-listening/reading, During, Post), TBL (Task-Based Learning), PIASP (Presentation, Isolation, Analysis, Stating the rule, Practice).
  - Target Competencies: Interact, Interpret, Produce.
  - Domain: Oral / Written (Receptive / Productive).
- **افتراض:** المنصة تُسلَّم فارغة تماماً من أي مذكرات أو بيانات حقيقية لأي أستاذ، والقوالب عبارة عن هياكل فارغة بحقول مهيأة لإدخال الأستاذ.

---

## 2. القرارات التقنية والمعمارية
- **إدارة الهوية والمصادقة:**
  - Supabase Auth + Postgres RLS مع إمكانية التشغيل المحلي والتطوير السلس (Mock/Local Auth fallback للاختبارات الآلية ووحدة التحقق من العزل).
- **قاعدة البيانات:**
  - Drizzle ORM مع مخططات صارمة لـ Users, Lessons, Templates, Assets, Sources (pgvector embeddings ready), Notifications, AuditLogs.
- **التصميم:**
  - اتجاه الواجهة عربي بالكامل (RTL) بينما مساحة عمل المذكرة إنجليزية (LTR) مع دعم BiDi المتكامل.
  - عدم استخدام أي إيموجي نهائياً في الواجهة أو الأيقونات، والاعتماد الحصري على مكتبة Lucide Icons.
- **التصدير:**
  - استخدام نفس مكونات العرض المعيارية ذات الأبعاد الحقيقية بالمليمتر/البكسل (A4, A3, Letter, etc.) للمعاينة والطباعة لضمان مطابقة 100%.
