"use client";
// @flow strict

import { isValidEmail } from "@/utils/check-email";
import axios from "axios";
import { useState } from "react";
import { TbMailForward } from "react-icons/tb";
import { toast } from "react-toastify";

function ContactForm() {
  const [error, setError] = useState({
    email: false,
    required: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: "",
  });

  const checkRequired = () => {
    const isMissing =
      !userInput.name.trim() ||
      !userInput.email.trim() ||
      !userInput.message.trim();

    setError((prev) => ({
      ...prev,
      required: isMissing,
    }));
  };

  const handleSendMail = async (e) => {
    e.preventDefault();

    const name = userInput.name.trim();
    const email = userInput.email.trim();
    const message = userInput.message.trim();

    if (!name || !email || !message) {
      setError((prev) => ({
        ...prev,
        required: true,
      }));
      return;
    }

    if (!isValidEmail(email)) {
      setError((prev) => ({
        ...prev,
        email: true,
      }));
      return;
    }

    setError({
      email: false,
      required: false,
    });

    try {
      setIsLoading(true);

      const res = await axios.post("/api/contact", {
        name,
        email,
        message,
      });

      toast.success(res?.data?.message || "Message sent successfully!");

      setUserInput({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to send message."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <p className="mb-5 text-xl font-medium uppercase text-[#16f2b3]">
        Contact Me
      </p>

      <div className="max-w-3xl rounded-lg border border-[#464c6a] p-3 text-white lg:p-5">
        <p className="text-sm text-[#d3d8e8]">
          {
            "I’m open to software engineering opportunities where I can contribute across the full stack, build reliable systems, and help deliver high-quality products. Feel free to reach out."
          }
        </p>

        <form onSubmit={handleSendMail} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-base">Your Name:</label>
            <input
              className="w-full rounded-md border border-[#353a52] bg-[#10172d] px-3 py-2 outline-0 ring-0 transition-all duration-300 focus:border-[#16f2b3]"
              type="text"
              maxLength={100}
              required
              value={userInput.name}
              onChange={(e) =>
                setUserInput({ ...userInput, name: e.target.value })
              }
              onBlur={checkRequired}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base">Your Email:</label>
            <input
              className="w-full rounded-md border border-[#353a52] bg-[#10172d] px-3 py-2 outline-0 ring-0 transition-all duration-300 focus:border-[#16f2b3]"
              type="email"
              maxLength={100}
              required
              value={userInput.email}
              onChange={(e) =>
                setUserInput({ ...userInput, email: e.target.value })
              }
              onBlur={() => {
                checkRequired();
                setError((prev) => ({
                  ...prev,
                  email: !isValidEmail(userInput.email.trim()),
                }));
              }}
            />
            {error.email && (
              <p className="text-sm text-red-400">
                Please provide a valid email!
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base">Your Message:</label>
            <textarea
              className="w-full rounded-md border border-[#353a52] bg-[#10172d] px-3 py-2 outline-0 ring-0 transition-all duration-300 focus:border-[#16f2b3]"
              maxLength={500}
              name="message"
              required
              rows={4}
              value={userInput.message}
              onChange={(e) =>
                setUserInput({ ...userInput, message: e.target.value })
              }
              onBlur={checkRequired}
            />
          </div>

          <div className="flex flex-col items-center gap-3">
            {error.required && (
              <p className="text-sm text-red-400">
                All fields are required!
              </p>
            )}

            <button
              type="submit"
              className="flex items-center gap-1 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-5 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:gap-3 hover:text-white hover:no-underline disabled:cursor-not-allowed disabled:opacity-70 md:px-12 md:py-3 md:text-sm md:font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Sending Message...</span>
              ) : (
                <span className="flex items-center gap-1">
                  Send Message
                  <TbMailForward size={20} />
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactForm;