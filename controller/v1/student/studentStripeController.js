import Batch from "../../../models/batch.js";
import Course from "../../../models/course.js";
import httpError from "../../../utils/httpError.js";
import Stripe from "stripe";
import Student from "../../../models/student.js";


//stripe integration

export const checkOutSession = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return next(new httpError("courde id not find"), 400);
    }

    const findCourse = await Course.findById({ _id: courseId });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: findCourse.title,
              description: findCourse.description,
            },
            unit_amount: Math.round(findCourse.disccountprice * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,

      metadata: {
        courseId: courseId,
        studentId: req.student.id,
      },
    });
    console.log("Session Metadata:", session.metadata);
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.log(error);
  }
};

//webhook

export const handleWebhook = async (req, res) => {
  console.log("🔹 Webhook received!");
  console.log("🔹 Headers:", req.headers);
  console.log("🔹 Raw Body:", req.body);  // Log the full raw body

  const sig = req.headers["stripe-signature"];
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
      const event = stripe.webhooks.constructEvent(
          req.body, // Make sure raw body is available
          sig,
          process.env.WEBHOOK_SECRET
      );

      console.log("✅ Webhook Event Type:", event.type);
      console.log("✅ Full Event Data:", event);

      if (event.type === "checkout.session.completed") {
          const session = event.data.object;
          console.log("✅ Session Metadata:", session.metadata);

          const { studentId, courseId } = session.metadata;

          if (!studentId || !courseId) {
              console.log("❌ Invalid studentId or courseId");
              return res.status(400).json({ message: "Invalid studentId or courseId" });
          }

          const student = await Student.findById(studentId);
          if (!student) {
              console.log("❌ Student not found:", studentId);
              return res.status(404).json({ message: "Student not found" });
          }

          const batch = await Batch.findOne({ course: courseId });
          if (!batch) {
              console.log("❌ Batch not found for course:", courseId);
              return res.status(404).json({ message: "Batch not found for this course" });
          }

          if (batch.students.includes(studentId)) {
              console.log("⚠️ Student already enrolled in batch");
              return res.status(400).json({ message: "Student already enrolled in batch" });
          }

          // ✅ Add student to batch
          batch.students.push(studentId);
          await batch.save(); 

          console.log("✅ Student added to batch successfully!");
          return res.status(200).json({ message: "Student added to batch successfully" });
      }

      res.json({ received: true });
  } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
