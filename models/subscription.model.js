import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription Name is required"],
        trim: true,
        minlength: [3, "Subscription Name must be at least 3 characters long"],
        maxlength: [50, "Subscription Name must be less than 50 characters long"],
    },
    price: {
        type: Number,
        required: [true, "Subscription Price is required"],
        min: [0, "Subscription Price must be greater than 0"],
    },
    description: {
        type: String,
        required: [true, "Subscription Description is required"],
        trim: true,
        minlength: [10, "Subscription Description must be at least 10 characters long"],
        maxlength: [1000, "Subscription Description must be less than 500 characters long"],
        default: "This is a new subscription for the service requested by you.",
    },
    currency: {
        type: String,
        required: [true, "Subscription Currency is required"],
        enum: ["USD", "EUR", "INR"],
        default: "INR",
    },
    frequency: {
        type: String,
        required: [true, "Subscription Frequency is required"],
        enum: ["daily", "weekly", "monthly", "yearly"],
        default: "monthly",
    },
    category: {
        type: String,
        required: [true, "Subscription Category is required"],
        enum: ["free", "basic", "pro", "enterprise"],
        default: "free",
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true,
        enum: ["UPI", "Debit Card", "Credit Card", "Bank Account"],
        default: "Credit Card",
    },
    status: {
        type: String,
        enum: ["active", "cancelled", "expired"],
        default: "active"
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator : (value) => value <= new Date(),
            message : "Start Date must be in the past",
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator : function (value){
                return value > this.startDate;
            },
            message : "Renewal date must be after start date",
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }

}, {timestamps: true});

// Auto-calculate renewal date if missing.
subscriptionSchema.pre('save', function (next) {
    if(!this.renewalDate) {
      const renewalPeriods = {
        daily: 1,
        weekly: 7,
        monthly: 30,
        yearly: 365,
      };
  
      this.renewalDate = new Date(this.startDate);
      this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }
  
    // Auto-update the status if renewal date has passed
    if (this.renewalDate < new Date()) {
      this.status = 'expired';
    }
  
    next();
  });

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;

