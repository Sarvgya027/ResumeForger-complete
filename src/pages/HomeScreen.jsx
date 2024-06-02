import React, { Suspense } from "react";
import Header from "../components/Header";
import { MainSpinner } from "../components";
import { Route, Routes } from "react-router-dom";
import { HomeContainer } from "../containers";
import {
  CreateResume,
  CreateTemplate,
  TemplateDesign,
  UserProfile,
} from "../pages";

function HomeScreen() {
  return (
    <div>
      {/* header component */}
      <Header />

      <main className="w-full">
        {/* custom routes */}
        <Suspense fallback={<MainSpinner />}>
          <Routes>
            <Route path="/" element={<HomeContainer />} />
            <Route path="/template/create" element={<CreateTemplate />} />
            <Route path="/profile/:uid" element={<UserProfile />} />
            <Route path="/resume/*" element={<CreateResume />} />
            <Route
              path="/resumeDetail/:templateID"
              element={<TemplateDesign />}
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default HomeScreen;
