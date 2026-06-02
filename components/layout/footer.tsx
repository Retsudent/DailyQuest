import Container from "@/components/layout/container";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row">
          
          <p className="text-sm text-gray-500">
            © 2026 DailyQuest. All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-sm text-gray-400">
            <a href="#">
              Privacy
            </a>

            <a href="#">
              Terms
            </a>

            <a href="#">
              Contact
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}