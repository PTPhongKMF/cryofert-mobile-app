import {
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonFooter,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import SafeAreaView from "@src/components/layout/SafeAreaView";
import React from "react";
import {
  HeartPulse,
  FlaskConical,
  Shield,
  Database,
  UserCheck,
  FileCheck,
  Clock,
  Lock,
  ArrowRight,
  Award,
  Users,
  TrendingUp,
  CheckCircle2,
  Star,
  Quote,
  Calendar,
  ClipboardCheck,
  Activity,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@src/routes/routes";
import CryoFertLogo from "@assets/images/logos/cryofert-logo.png";

export default function LandingHome() {
  return (
    <IonContent>
      <SafeAreaView>
        <div className="flex flex-col gap-8 bg-gradient-to-b from-sky-50 via-blue-50 to-white px-4 py-6">
          {/* Header (compact for mobile) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-600">
              <img src={CryoFertLogo} className="h-10 w-10" />
              <span className="font-bold text-lg">CryoFert</span>
            </div>
          </div>

          {/* Hero */}
          <section className="flex flex-col items-center text-center gap-4">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium">
              <FlaskConical className="h-4 w-4" />
              Professional Fertility & Cryobank Management
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
              Your Journey to Parenthood Starts Here
            </h1>
            <p className="text-sm text-slate-600">
              Advanced fertility treatments backed by cutting-edge technology
              and compassionate care.
            </p>
            <div className="flex w-full flex-col sm:flex-row gap-3">
              <PrimaryButton className="w-full py-1! rounded-md!">
                <Link to={ROUTES.L_AUTH_LOGIN}>
                  <span className="inline-flex items-center justify-center text-white">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Link>
              </PrimaryButton>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-2 gap-4 w-full mt-2">
              <StatItem value="15+" label="Years Experience" />
              <StatItem value="10,000+" label="Successful Pregnancies" />
              <StatItem value="45%" label="Avg. Success Rate" />
              <StatItem value="98%" label="Patient Satisfaction" />
            </div>
          </section>

          {/* About */}
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">
              Leading the Way in Fertility Care
            </h2>
            <p className="text-sm text-slate-600">
              CryoBank is a state-of-the-art fertility clinic and cryobank
              facility combining advanced technology with personalized,
              compassionate care.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <MobileCard className="text-center p-4 bg-white/80 backdrop-blur border-blue-100">
                <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold">CAP Accredited</div>
                <div className="text-xs text-slate-600">
                  Laboratory Excellence
                </div>
              </MobileCard>
              <MobileCard className="text-center p-4 bg-white/80 backdrop-blur border-blue-100">
                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold">HIPAA</div>
                <div className="text-xs text-slate-600">Data Security</div>
              </MobileCard>
              <MobileCard className="text-center p-4 bg-white/80 backdrop-blur border-blue-100">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold">50+ Staff</div>
                <div className="text-xs text-slate-600">Dedicated Team</div>
              </MobileCard>
              <MobileCard className="text-center p-4 bg-white/80 backdrop-blur border-blue-100">
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold">Top 10%</div>
                <div className="text-xs text-slate-600">Success Rates</div>
              </MobileCard>
            </div>
            <div className="space-y-3">
              <Bullet
                title="Advanced Laboratory Technology"
                subtitle="IVF lab with strict quality control"
              />
              <Bullet
                title="Expert Medical Team"
                subtitle="Board‑certified specialists"
              />
              <Bullet
                title="Personalized Treatment Plans"
                subtitle="Care tailored to your needs"
              />
            </div>
          </section>

          {/* How it works */}
          <section className="flex flex-col gap-4">
            <SectionTitle
              title="How It Works"
              subtitle="Your journey in four simple steps"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ProcessStepMobile
                number="1"
                title="Consultation"
                icon={<Calendar className="h-5 w-5" />}
                description="Meet our specialists and discuss goals."
              />
              <ProcessStepMobile
                number="2"
                title="Testing"
                icon={<ClipboardCheck className="h-5 w-5" />}
                description="Comprehensive evaluation and labs."
              />
              <ProcessStepMobile
                number="3"
                title="Plan"
                icon={<Target className="h-5 w-5" />}
                description="Receive a personalized protocol."
              />
              <ProcessStepMobile
                number="4"
                title="Begin"
                icon={<Activity className="h-5 w-5" />}
                description="Start with continuous support."
              />
            </div>
          </section>

          {/* Services */}
          <section className="flex flex-col gap-4">
            <SectionTitle
              title="Our Services"
              subtitle="Comprehensive fertility treatments"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ServiceCardMobile
                icon={<HeartPulse className="h-7 w-7 text-blue-600" />}
                title="IVF"
                description="Advanced lab protocols and monitoring."
              />
              <ServiceCardMobile
                icon={<UserCheck className="h-7 w-7 text-blue-600" />}
                title="IUI"
                description="Optimized timing for better outcomes."
              />
              <ServiceCardMobile
                icon={<Database className="h-7 w-7 text-blue-600" />}
                title="Egg Freezing"
                description="Modern vitrification technology."
              />
              <ServiceCardMobile
                icon={<FlaskConical className="h-7 w-7 text-blue-600" />}
                title="Embryo Freezing"
                description="Secure storage & monitoring."
              />
              <ServiceCardMobile
                icon={<Shield className="h-7 w-7 text-blue-600" />}
                title="Preservation"
                description="Medical and personal options."
              />
              <ServiceCardMobile
                icon={<UserCheck className="h-7 w-7 text-blue-600" />}
                title="Male Fertility"
                description="Complete assessment & care."
              />
            </div>
            <div className="flex justify-center">
              <OutlineButton>
                {/* <a href="#services"> */}
                <span className="inline-flex items-center">
                  View All Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
                {/* </a> */}
              </OutlineButton>
            </div>
          </section>

          {/* Features */}
          <section className="flex flex-col gap-4">
            <SectionTitle
              title="Why Choose CryoBank"
              subtitle="Everything you need for success"
            />
            <div className="grid grid-cols-1 gap-3">
              <FeatureItemMobile
                title="Security & Privacy"
                description="HIPAA-compliant systems and encryption."
                icon={<Lock className="h-5 w-5" />}
              />
              <FeatureItemMobile
                title="24/7 Monitoring"
                description="Round-the-clock storage monitoring."
                icon={<Clock className="h-5 w-5" />}
              />
              <FeatureItemMobile
                title="Patient Portal"
                description="Access results, schedules and resources."
                icon={<FileCheck className="h-5 w-5" />}
              />
              <FeatureItemMobile
                title="Transparent Reports"
                description="Detailed progress and summaries."
                icon={<Database className="h-5 w-5" />}
              />
            </div>
          </section>

          {/* Testimonials */}
          <section className="flex flex-col gap-4">
            <SectionTitle
              title="Success Stories"
              subtitle="Real families, real results"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TestimonialCardMobile
                quote="After years of trying, we're now proud parents of twins!"
                author="Sarah & Michael"
                treatment="IVF"
                rating={5}
              />
              <TestimonialCardMobile
                quote="Egg freezing was smooth and empowering."
                author="Jennifer L."
                treatment="Egg Freezing"
                rating={5}
              />
              <TestimonialCardMobile
                quote="Personalized care and clear communication throughout."
                author="David & Emily"
                treatment="IUI"
                rating={5}
              />
            </div>
          </section>

          {/* FAQ */}
          <section className="flex flex-col gap-4">
            <SectionTitle title="FAQ" subtitle="Common questions answered" />
            <div className="space-y-3">
              <FAQItemMobile
                question="What is the IVF success rate?"
                answer="Varies by age; ~45-50% under 35 per cycle."
              />
              <FAQItemMobile
                question="How much does treatment cost?"
                answer="IUI $500-$2,500; IVF $15,000-$25,000 incl. meds."
              />
              <FAQItemMobile
                question="How long does IVF take?"
                answer="Typically 4-6 weeks for a full cycle."
              />
              <FAQItemMobile
                question="Do you accept insurance?"
                answer="We work with most major providers."
              />
            </div>
          </section>

          {/* CTA */}
          <section className="flex flex-col items-center text-center gap-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-6">
            <HeartPulse className="h-12 w-12 text-blue-600" />
            <h3 className="text-2xl font-bold">Ready to Start?</h3>
            <p className="text-sm text-slate-600 max-w-md">
              Take the first step. Our expert team will guide you with
              personalized care and advanced treatments.
            </p>
            <div className="flex w-full flex-col sm:flex-row gap-3">
              <PrimaryButton className="w-full py-1! rounded-sm!">
                <Link to={ROUTES.L_AUTH_LOGIN}>
                  <span className="inline-flex items-center justify-center text-white">
                    Schedule Free Consultation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Link>
              </PrimaryButton>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-600">
              <div className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-teal-500" />
                Free Consultation
              </div>
              <div className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-teal-500" />
                Payment Plans
              </div>
              <div className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-teal-500" />
                Insurance Accepted
              </div>
            </div>
          </section>

          {/* Footer (compact) */}
          <footer className="border-t border-blue-100 pt-6 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <HeartPulse className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">CryoBank</span>
            </div>
            <p className="text-xs text-slate-600">
              © 2025 CryoBank. Advanced fertility service and cryobank
              management.
            </p>
          </footer>
        </div>
      </SafeAreaView>
    </IonContent>
  );
}

type WithChildren<T = {}> = T & {
  children?: React.ReactNode;
  className?: string;
};

function MobileCard({ children, className = "" }: WithChildren) {
  return (
    <div className={`rounded-xl border border-blue-100 bg-white ${className}`}>
      {children}
    </div>
  );
}

function PrimaryButton({ children, className = "" }: WithChildren) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium shadow-sm active:scale-[0.99] ${className}`}
    >
      {children}
    </button>
  );
}

function OutlineButton({ children, className = "" }: WithChildren) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg border border-blue-200 text-blue-700 px-4 py-2 text-sm font-medium active:scale-[0.99] ${className}`}
    >
      {children}
    </button>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-1">{title}</h2>
      {subtitle ? (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center rounded-xl border border-blue-100 bg-white py-3">
      <div className="text-xl font-bold text-blue-600">{value}</div>
      <div className="text-[11px] text-slate-600">{label}</div>
    </div>
  );
}

function Bullet({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="h-5 w-5 text-teal-500 mt-0.5" />
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-slate-600">{subtitle}</div>
      </div>
    </div>
  );
}

function FeatureItemMobile({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-blue-100 bg-white p-4">
      <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-xs text-slate-600">{description}</p>
      </div>
    </div>
  );
}

function ProcessStepMobile({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <MobileCard className="p-4 relative">
      <div className="absolute -top-3 left-4 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow">
        {number}
      </div>
      <div className="mt-2 flex flex-col items-start gap-2">
        <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-xs text-slate-600">{description}</p>
      </div>
    </MobileCard>
  );
}

function ServiceCardMobile({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <MobileCard className="p-4">
      <div className="h-11 w-11 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
        {icon}
      </div>
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-xs text-slate-600">{description}</div>
      {/* <div className="pt-2"><Button variant="ghost">Learn More</Button></div> */}
    </MobileCard>
  );
}

function TestimonialCardMobile({
  quote,
  author,
  treatment,
  rating,
}: {
  quote: string;
  author: string;
  treatment: string;
  rating: number;
}) {
  return (
    <MobileCard className="p-4 bg-white/90">
      <Quote className="h-7 w-7 text-blue-400/40 mb-2" />
      <p className="text-sm text-slate-600 italic mb-2">“{quote}”</p>
      <div className="flex gap-1 mb-2">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <div className="font-medium">{author}</div>
      <div className="text-xs text-slate-600">{treatment}</div>
    </MobileCard>
  );
}

function FAQItemMobile({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <MobileCard className="p-4">
      <div className="text-sm font-semibold flex items-start gap-2">
        <CheckCircle2 className="h-4 w-4 text-teal-500 mt-0.5" />
        {question}
      </div>
      <p className="text-xs text-slate-600 mt-2">{answer}</p>
    </MobileCard>
  );
}
