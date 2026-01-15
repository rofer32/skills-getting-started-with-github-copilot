document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // In-memory activity database (hardcoded data)
  let activities = {
    "Sport": {
      "description": "Physical education and sports activities including basketball, soccer, and volleyball",
      "schedule": "Mondays, Wednesdays, Fridays, 3:30 PM - 5:00 PM",
      "max_participants": 25,
      "participants": ["john@mergington.edu", "olivia@mergington.edu"]
    },
    "Culture": {
      "description": "Explore art, music, theater, and cultural diversity through various activities",
      "schedule": "Tuesdays and Thursdays, 3:30 PM - 4:30 PM",
      "max_participants": 20,
      "participants": ["emma@mergington.edu", "sophia@mergington.edu"]
    },
    "Chess Club": {
      "description": "Learn strategies and compete in chess tournaments",
      "schedule": "Fridays, 3:30 PM - 5:00 PM",
      "max_participants": 12,
      "participants": ["michael@mergington.edu", "daniel@mergington.edu"]
    },
    "Programming Class": {
      "description": "Learn programming fundamentals and build software projects",
      "schedule": "Tuesdays and Thursdays, 4:45 PM - 5:45 PM",
      "max_participants": 20,
      "participants": []
    }
  };

  // Function to display activities
  function fetchActivities() {
    try {

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;
        
        // Create participants list with delete buttons
        const participantsList = details.participants.length > 0 
          ? details.participants.map(p => `
              <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span>${p}</span>
                <button class="delete-btn" data-activity="${name}" data-email="${p}" style="background-color: #d32f2f; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 12px;">Delete</button>
              </li>
            `).join('')
          : '<li><em>No participants yet</em></li>';

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <p><strong>Participants:</strong></p>
          <ul style="margin-left: 20px; margin-top: 8px; list-style: none; padding: 0;">
            ${participantsList}
          </ul>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      messageDiv.textContent = "Please enter a valid email address";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      return;
    }

    // Validate activity exists
    if (!activities[activity]) {
      messageDiv.textContent = "Activity not found";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      return;
    }

    const activityData = activities[activity];

    // Check if already signed up
    if (activityData.participants.includes(email)) {
      messageDiv.textContent = "Student already signed up for this activity";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      return;
    }

    // Check capacity
    if (activityData.participants.length >= activityData.max_participants) {
      messageDiv.textContent = "Activity is full";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      return;
    }

    // Add student
    activityData.participants.push(email);
    messageDiv.textContent = `Signed up ${email} for ${activity}`;
    messageDiv.className = "success";
    signupForm.reset();
    fetchActivities(); // Refresh the display
    
    messageDiv.classList.remove("hidden");
    setTimeout(() => {
      messageDiv.classList.add("hidden");
    }, 5000);
  });

  // Handle delete participant
  activitiesList.addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-btn")) {
      const activity = event.target.dataset.activity;
      const email = event.target.dataset.email;
      
      if (!confirm(`Are you sure you want to remove ${email} from ${activity}?`)) {
        return;
      }

      // Remove participant
      const activityData = activities[activity];
      const index = activityData.participants.indexOf(email);
      
      if (index > -1) {
        activityData.participants.splice(index, 1);
        messageDiv.textContent = `Removed ${email} from ${activity}`;
        messageDiv.className = "success";
        fetchActivities(); // Refresh the display
      } else {
        messageDiv.textContent = "Participant not found";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    }
  });

  // Initialize app
  fetchActivities();
});
