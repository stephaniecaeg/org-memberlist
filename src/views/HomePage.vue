<template>
  <ion-page>
    <!-- HEADER -->
    <ion-header class="main-header">
      <ion-toolbar>
        <div class="header-content">
          <div class="header-icon">🏛️</div>

          <div>
            <h1>Organization Member List</h1>
            <p>Member Management System</p>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content>

      <!-- PAGE CONTENT -->
      <div class="page-container">

        <!-- WELCOME / SUMMARY -->
        <div class="welcome-section">
          <div>
            <h2>Members</h2>
            <p>Manage your organization members.</p>
          </div>

          <div class="member-count">
            <span>{{ members.length }}</span>
            <small>Total Members</small>
          </div>
        </div>


        <!-- ADD / EDIT FORM -->
        <ion-card class="form-card">

          <ion-card-header>
            <div class="card-title-row">
              <div>
                <ion-card-title>
                  {{ editingId ? 'Edit Member' : 'Add New Member' }}
                </ion-card-title>

                <ion-card-subtitle>
                  {{ editingId
                    ? 'Update member information'
                    : 'Enter the member information below'
                  }}
                </ion-card-subtitle>
              </div>

              <div class="form-icon">
                {{ editingId ? '✏️' : '➕' }}
              </div>
            </div>
          </ion-card-header>

          <ion-card-content>

            <div class="form-grid">

              <!-- MEMBER ID -->
              <ion-item>
                <ion-input
                  v-model="memberId"
                  label="Member ID"
                  label-placement="floating"
                  placeholder="e.g. 2026-001"
                />
              </ion-item>

              <!-- NAME -->
              <ion-item>
                <ion-input
                  v-model="memberName"
                  label="Full Name"
                  label-placement="floating"
                  placeholder="Enter full name"
                />
              </ion-item>

              <!-- COURSE -->
              <ion-item>
                <ion-input
                  v-model="memberCourse"
                  label="Course"
                  label-placement="floating"
                  placeholder="e.g. BS Information Technology"
                />
              </ion-item>

              <!-- YEAR LEVEL -->
              <ion-item>
                <ion-select
                  v-model="memberYearLevel"
                  label="Year Level"
                  label-placement="floating"
                  placeholder="Select year level"
                >
                  <ion-select-option value="1st Year">
                    1st Year
                  </ion-select-option>

                  <ion-select-option value="2nd Year">
                    2nd Year
                  </ion-select-option>

                  <ion-select-option value="3rd Year">
                    3rd Year
                  </ion-select-option>

                  <ion-select-option value="4th Year">
                    4th Year
                  </ion-select-option>
                </ion-select>
              </ion-item>

              <!-- POSITION -->
              <ion-item>
                <ion-input
                  v-model="memberPosition"
                  label="Organization Position"
                  label-placement="floating"
                  placeholder="e.g. President"
                />
              </ion-item>

              <!-- CONTACT -->
              <ion-item>
                <ion-input
                  v-model="memberContact"
                  label="Contact Information"
                  label-placement="floating"
                  placeholder="e.g. 09123456789"
                  type="tel"
                />
              </ion-item>

            </div>


            <!-- FORM BUTTONS -->
            <div class="form-buttons">

              <ion-button
                class="save-button"
                @click="editingId ? updateMember() : addMember()"
              >
                <span class="button-icon">
                  {{ editingId ? '✓' : '+' }}
                </span>

                {{ editingId ? 'Update Member' : 'Add Member' }}
              </ion-button>

              <ion-button
                v-if="editingId"
                fill="outline"
                color="medium"
                @click="cancelEdit"
              >
                Cancel
              </ion-button>

            </div>

          </ion-card-content>
        </ion-card>


        <!-- SEARCH -->
        <div class="search-section">

          <ion-searchbar
            v-model="searchQuery"
            placeholder="Search members..."
            :debounce="200"
          />

        </div>


        <!-- MEMBER LIST -->
        <div class="section-heading">
          <div>
            <h2>Organization Members</h2>
            <p>
              {{ filteredMembers.length }} member(s) found
            </p>
          </div>
        </div>


        <!-- EMPTY STATE -->
        <div
          v-if="filteredMembers.length === 0"
          class="empty-state"
        >
          <div class="empty-icon">👥</div>

          <h3>No members found</h3>

          <p>
            Add a new organization member to get started.
          </p>
        </div>


        <!-- MEMBER CARDS -->
        <div
          v-else
          class="members-grid"
        >

          <ion-card
            v-for="member in filteredMembers"
            :key="member.id"
            class="member-card"
          >

            <!-- CARD TOP -->
            <div class="member-top">

              <div class="avatar">
                {{ getInitials(member.name) }}
              </div>

              <div class="member-main">

                <h3>
                  {{ member.name }}
                </h3>

                <span class="member-id">
                  ID: {{ member.memberId }}
                </span>

              </div>

            </div>


            <!-- MEMBER DETAILS -->
            <div class="member-details">

              <div class="detail-row">
                <span class="detail-icon">🎓</span>

                <div>
                  <small>Course</small>
                  <strong>{{ member.course }}</strong>
                </div>
              </div>


              <div class="detail-row">
                <span class="detail-icon">📚</span>

                <div>
                  <small>Year Level</small>
                  <strong>{{ member.yearLevel }}</strong>
                </div>
              </div>


              <div class="detail-row">
                <span class="detail-icon">⭐</span>

                <div>
                  <small>Organization Position</small>
                  <strong>{{ member.position }}</strong>
                </div>
              </div>


              <div class="detail-row">
                <span class="detail-icon">📞</span>

                <div>
                  <small>Contact Information</small>
                  <strong>{{ member.contact }}</strong>
                </div>
              </div>

            </div>


            <!-- CARD ACTIONS -->
            <div class="member-actions">

              <ion-button
                fill="outline"
                class="edit-button"
                @click="editMember(member)"
              >
                ✏️ Edit
              </ion-button>

              <ion-button
                fill="outline"
                class="delete-button"
                @click="deleteMember(member.id)"
              >
                🗑️ Delete
              </ion-button>

            </div>

          </ion-card>

        </div>

      </div>

    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">

import {
  ref,
  computed,
  onMounted
} from 'vue';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonSearchbar
} from '@ionic/vue';

import { db } from '../firebase';

import {
  ref as dbRef,
  push,
  onValue,
  remove,
  update
} from 'firebase/database';


// ==============================
// MEMBER INTERFACE
// ==============================

interface Member {
  id: string;
  memberId: string;
  name: string;
  course: string;
  yearLevel: string;
  position: string;
  contact: string;
}


// ==============================
// FORM DATA
// ==============================

const memberId = ref('');
const memberName = ref('');
const memberCourse = ref('');
const memberYearLevel = ref('');
const memberPosition = ref('');
const memberContact = ref('');

const members = ref<Member[]>([]);

const editingId = ref<string | null>(null);

const searchQuery = ref('');


// ==============================
// FIREBASE
// ==============================

const membersRef = dbRef(db, 'members');


// ==============================
// SEARCH / FILTER
// ==============================

const filteredMembers = computed(() => {

  const query = searchQuery.value
    .toLowerCase()
    .trim();

  if (!query) {
    return members.value;
  }

  return members.value.filter((member) => {

    return (
      member.memberId.toLowerCase().includes(query) ||
      member.name.toLowerCase().includes(query) ||
      member.course.toLowerCase().includes(query) ||
      member.yearLevel.toLowerCase().includes(query) ||
      member.position.toLowerCase().includes(query) ||
      member.contact.toLowerCase().includes(query)
    );

  });

});


// ==============================
// GET INITIALS
// ==============================

const getInitials = (name: string) => {

  const words = name.trim().split(' ');

  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  return (
    words[0][0] +
    words[words.length - 1][0]
  ).toUpperCase();

};


// ==============================
// ADD MEMBER
// ==============================

const addMember = async () => {

  const memberIdValue = memberId.value.trim();
  const nameValue = memberName.value.trim();
  const courseValue = memberCourse.value.trim();
  const yearLevelValue = memberYearLevel.value;
  const positionValue = memberPosition.value.trim();
  const contactValue = memberContact.value.trim();


  // MEMBER ID
  if (!memberIdValue) {
    alert('Please enter Member ID.');
    return;
  }


  // FULL NAME
  if (!nameValue) {
    alert('Please enter Full Name.');
    return;
  }


  // COURSE
  if (!courseValue) {
    alert('Please enter Course.');
    return;
  }


  // YEAR LEVEL
  if (!yearLevelValue) {
    alert('Please enter Year Level.');
    return;
  }


  // POSITION
  if (!positionValue) {
    alert('Please enter Position.');
    return;
  }


  // CONTACT NUMBER
  if (!contactValue) {
    alert('Please enter Contact Number.');
    return;
  }


  // MOBILE NUMBER MUST BE 11 DIGITS
  if (contactValue.length < 11) {
    alert('Mobile number must be 11 digits.');
    return;
  }


  // SAVE TO FIREBASE
  await push(membersRef, {
    memberId: memberIdValue,
    name: nameValue,
    course: courseValue,
    yearLevel: yearLevelValue,
    position: positionValue,
    contact: contactValue
  });


  clearForm();

};


// ==============================
// EDIT MEMBER
// ==============================

const editMember = (member: Member) => {

  editingId.value = member.id;

  memberId.value = member.memberId;

  memberName.value = member.name;

  memberCourse.value = member.course;

  memberYearLevel.value = member.yearLevel;

  memberPosition.value = member.position;

  memberContact.value = member.contact;

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

};


// ==============================
// UPDATE MEMBER
// ==============================

const updateMember = async () => {

  if (!editingId.value) {
    return;
  }

  if (
    !memberId.value ||
    !memberName.value ||
    !memberCourse.value ||
    !memberYearLevel.value ||
    !memberPosition.value ||
    !memberContact.value
  ) {

    alert('Please complete all member information.');

    return;
  }

  await update(
    dbRef(
      db,
      'members/' + editingId.value
    ),
    {

      memberId: memberId.value,

      name: memberName.value,

      course: memberCourse.value,

      yearLevel: memberYearLevel.value,

      position: memberPosition.value,

      contact: memberContact.value

    }
  );

  clearForm();

};


// ==============================
// DELETE MEMBER
// ==============================

const deleteMember = async (id: string) => {

  const confirmDelete = confirm(
    'Are you sure you want to delete this member?'
  );

  if (!confirmDelete) {
    return;
  }

  await remove(
    dbRef(
      db,
      'members/' + id
    )
  );

};


// ==============================
// CANCEL EDIT
// ==============================

const cancelEdit = () => {

  clearForm();

};


// ==============================
// CLEAR FORM
// ==============================

const clearForm = () => {

  editingId.value = null;

  memberId.value = '';

  memberName.value = '';

  memberCourse.value = '';

  memberYearLevel.value = '';

  memberPosition.value = '';

  memberContact.value = '';

};


// ==============================
// LOAD MEMBERS
// ==============================

onMounted(() => {

  onValue(
    membersRef,
    (snapshot) => {

      const data = snapshot.val();

      if (data) {

        members.value =
          Object.keys(data).map((id) => ({

            id,

            memberId: data[id].memberId,

            name: data[id].name,

            course: data[id].course,

            yearLevel: data[id].yearLevel,

            position: data[id].position,

            contact: data[id].contact

          }));

      } else {

        members.value = [];

      }

    }
  );

});

</script>


<style scoped>

ion-content {
  --background: #f4f7fa;
}


/* ==============================
   HEADER
   ============================== */

.main-header ion-toolbar {
  --background: #12355b;
  --color: white;
  padding: 12px 18px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: #2d9cdb;
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 24px;
}

.header-content h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.header-content p {
  margin: 3px 0 0;
  font-size: 12px;
  opacity: 0.8;
}


/* ==============================
   CONTAINER
   ============================== */

.page-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 18px 50px;
}


/* ==============================
   WELCOME
   ============================== */

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.welcome-section h2 {
  margin: 0;
  color: #12355b;
  font-size: 28px;
  font-weight: 800;
}

.welcome-section p {
  margin: 5px 0 0;
  color: #687786;
}

.member-count {
  min-width: 110px;
  padding: 12px 18px;
  background: white;
  border-radius: 14px;
  text-align: center;
  box-shadow: 0 3px 12px rgba(18, 53, 91, 0.08);
}

.member-count span {
  display: block;
  font-size: 25px;
  font-weight: 800;
  color: #12355b;
}

.member-count small {
  color: #687786;
}


/* ==============================
   FORM CARD
   ============================== */

.form-card {
  margin: 0 0 22px;
  border-radius: 18px;
  box-shadow: 0 5px 20px rgba(18, 53, 91, 0.08);
}

.card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #e8f5fc;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.form-grid ion-item {
  --background: #f8fafc;
  --border-radius: 10px;
  margin-bottom: 2px;
}

.form-buttons {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.save-button {
  --background: #2d9cdb;
  --border-radius: 10px;
  font-weight: 700;
}


/* ==============================
   SEARCH
   ============================== */

.search-section {
  margin: 10px 0 20px;
}

.search-section ion-searchbar {
  --background: white;
  --border-radius: 12px;
  --box-shadow: 0 3px 12px rgba(18, 53, 91, 0.07);
  padding: 0;
}


/* ==============================
   SECTION HEADING
   ============================== */

.section-heading {
  margin-bottom: 14px;
}

.section-heading h2 {
  margin: 0;
  color: #12355b;
  font-size: 21px;
  font-weight: 800;
}

.section-heading p {
  margin: 4px 0;
  color: #7a8794;
  font-size: 13px;
}


/* ==============================
   MEMBER GRID
   ============================== */

.members-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.member-card {
  margin: 0;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(18, 53, 91, 0.08);
}


/* ==============================
   MEMBER TOP
   ============================== */

.member-top {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  background: #12355b;
  color: white;
}

.avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #2d9cdb;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
  font-weight: 800;
}

.member-main h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.member-id {
  display: inline-block;
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.8;
}


/* ==============================
   DETAILS
   ============================== */

.member-details {
  padding: 15px 18px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid #edf1f4;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #edf7fc;

  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-row small {
  display: block;
  color: #84909b;
  font-size: 10px;
  margin-bottom: 2px;
}

.detail-row strong {
  display: block;
  color: #263746;
  font-size: 13px;
}


/* ==============================
   ACTIONS
   ============================== */

.member-actions {
  display: flex;
  gap: 8px;
  padding: 0 18px 18px;
}

.member-actions ion-button {
  flex: 1;
  margin: 0;
  --border-radius: 9px;
  font-size: 12px;
  font-weight: 700;
}

.edit-button {
  --color: #2d9cdb;
  --border-color: #2d9cdb;
}

.delete-button {
  --color: #e74c3c;
  --border-color: #e74c3c;
}


/* ==============================
   EMPTY STATE
   ============================== */

.empty-state {
  text-align: center;
  background: white;
  border-radius: 18px;
  padding: 45px 20px;
  box-shadow: 0 4px 15px rgba(18, 53, 91, 0.06);
}

.empty-icon {
  font-size: 45px;
  margin-bottom: 10px;
}

.empty-state h3 {
  margin: 0;
  color: #12355b;
}

.empty-state p {
  color: #7a8794;
  font-size: 13px;
}


/* ==============================
   RESPONSIVE
   ============================== */

@media (max-width: 700px) {

  .page-container {
    padding: 18px 12px 40px;
  }

  .welcome-section {
    align-items: flex-start;
  }

  .welcome-section h2 {
    font-size: 23px;
  }

  .member-count {
    min-width: 85px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .members-grid {
    grid-template-columns: 1fr;
  }

  .header-content h1 {
    font-size: 16px;
  }

  .header-icon {
    width: 42px;
    height: 42px;
    font-size: 20px;
  }

}

</style>