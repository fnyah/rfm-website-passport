"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Ported from the click-to-reveal contact block in views/about.ejs, rebuilt
 * as an accessible toggle button instead of an onclick handler on a <p>.
 */
export function ContactReveal() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="text-center text-muted-foreground">
      <p>
        Rose Fine-Meyer, PhD
        <br />
        Department of Curriculum, Teaching and Learning
        <br />
        Ontario Institute for Studies in Education
        <br />
        University of Toronto
        <br />
        Toronto, ON, M5S 1V6
      </p>
      {revealed ? (
        <p className="mt-3 text-foreground">
          Phone: 416-978-0074
          <br />
          Email:{" "}
          <a
            href="mailto:rose.fine.meyer@utoronto.ca"
            className="text-primary underline underline-offset-2"
          >
            rose.fine.meyer@utoronto.ca
          </a>
        </p>
      ) : (
        <Button
          variant="link"
          className="mt-2 px-0"
          aria-expanded={revealed}
          onClick={() => setRevealed(true)}
        >
          Click to reveal contact info
        </Button>
      )}
    </div>
  );
}
