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
        const res = await API.get("/auth/me");

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

  // Submit profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const updatedData = {
        ...formData,

        hobbies: formData.hobbies
          .split(",")
          .map((hobby) => hobby.trim()),
      };

      await API.put("/auth/profile", updatedData);

      alert("Profile updated successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell p-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-primary/15 bg-white p-8 shadow-[0_10px_30px_rgba(249,115,22,0.08)]">
        <h1 className="mb-8 text-4xl font-black tracking-tight text-ink">
          Edit Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="form-input"
          />

          <input
            type="text"
            name="occupation"
            placeholder="Occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="form-input"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="form-input"
          />

          <input
            type="number"
            name="budget"
            placeholder="Budget"
            value={formData.budget}
            onChange={handleChange}
            className="form-input"
          />

          <textarea
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
            className="form-input min-h-[120px] resize-none"
          />

          <input
            type="text"
            name="hobbies"
            placeholder="Hobbies (comma separated)"
            value={formData.hobbies}
            onChange={handleChange}
            className="form-input"
          />

          <select
            name="personality"
            value={formData.personality}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Select Personality</option>
            <option value="introvert">Introvert</option>
            <option value="extrovert">Extrovert</option>
            <option value="ambivert">Ambivert</option>
          </select>

          <button type="submit" className="btn-primary w-full">
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
