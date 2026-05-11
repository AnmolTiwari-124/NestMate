import { useEffect, useState } from "react";
import API from "../../services/api";

function Profile() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    occupation: "",
    bio: "",
    budget: "",
    location: "",
    personality: "",
    hobbies: "",
    habits: {
      sleepTime: "",
      cleanliness: "",
      smoking: false,
      drinking: false,
      foodPreference: "",
    },
  });

  const [loading, setLoading] = useState(false);

  // Fetch current user
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData({
          age: res.data.age || "",
          gender: res.data.gender || "",
          occupation: res.data.occupation || "",
          bio: res.data.bio || "",
          budget: res.data.budget || "",
          location: res.data.location || "",
          personality: res.data.personality || "",
          hobbies: res.data.hobbies?.join(", ") || "",
          habits: {
            sleepTime:
              res.data.habits?.sleepTime || "",
            cleanliness:
              res.data.habits?.cleanliness || "",
            smoking:
              res.data.habits?.smoking || false,
            drinking:
              res.data.habits?.drinking || false,
            foodPreference:
              res.data.habits?.foodPreference || "",
          },
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  // Handle normal inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle habits
  const handleHabitsChange = (e) => {
    setFormData({
      ...formData,
      habits: {
        ...formData.habits,
        [e.target.name]:
          e.target.type === "checkbox"
            ? e.target.checked
            : e.target.value,
      },
    });
  };

  // Submit profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const updatedData = {
        ...formData,

        hobbies: formData.hobbies
          .split(",")
          .map((hobby) => hobby.trim()),
      };

      await API.put(
        "/auth/profile",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile updated successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-3xl mx-auto bg-zinc-900 p-8 rounded-xl">
        <h1 className="text-4xl font-bold mb-8">
          Edit Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-3 rounded bg-zinc-800"
          />

          <input
            type="text"
            name="occupation"
            placeholder="Occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="w-full p-3 rounded bg-zinc-800"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 rounded bg-zinc-800"
          />

          <input
            type="number"
            name="budget"
            placeholder="Budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full p-3 rounded bg-zinc-800"
          />

          <textarea
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-3 rounded bg-zinc-800"
          />

          <input
            type="text"
            name="hobbies"
            placeholder="Hobbies (comma separated)"
            value={formData.hobbies}
            onChange={handleChange}
            className="w-full p-3 rounded bg-zinc-800"
          />

          <select
            name="personality"
            value={formData.personality}
            onChange={handleChange}
            className="w-full p-3 rounded bg-zinc-800"
          >
            <option value="">
              Select Personality
            </option>

            <option value="introvert">
              Introvert
            </option>

            <option value="extrovert">
              Extrovert
            </option>

            <option value="ambivert">
              Ambivert
            </option>
          </select>

          <button
            type="submit"
            className="w-full bg-white text-black p-3 rounded font-semibold"
          >
            {loading
              ? "Saving..."
              : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;