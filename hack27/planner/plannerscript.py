from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
import json

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
    top_p=1.0,              # <── THIS REDUCES HALLUCINATION A LOT
    top_k=1,              # <── Forces most deterministic token selection
    
)

def generate_dsl(user_prompt: str) -> str:
    """
    Call Gemini and return ONLY pure Manim code (NO JSON).
    """

    system_prompt = """
You are an educational Manim animation generator.

You will receive a topic and must output ONLY valid Python Manim code.
DO NOT return JSON.
DO NOT return markdown.
DO NOT add backticks.
DO NOT add explanations or comments.
Return ONLY the Manim Python script exactly as it should be executed.

Use this reference style (fixed frame, clean animations, no comments):

from manim import *

config.frame_width = 14
config.frame_height = 7.5

class CNNVisualization(Scene):
    def construct(self):
        title = Text("How a CNN Works", font_size=42).to_edge(UP)
        self.play(FadeIn(title))
        self.wait(0.5)

        text_box = Rectangle(width=6.5, height=1.3, color=BLUE)
        text_box.to_edge(DOWN)
        step_text = Text("", font_size=26).move_to(text_box.get_center())

        self.play(Create(text_box))
        self.add(step_text)

        def update_text(new_text):
            self.play(FadeOut(step_text, shift=UP*0.3), run_time=0.3)
            step_text.become(Text(new_text, font_size=26).move_to(text_box.get_center()))
            self.play(FadeIn(step_text, shift=DOWN*0.3), run_time=0.3)

        self.play(FadeIn(Text("Example animation start"), shift=RIGHT))
        self.wait(1)
        MPORTANT RULES (NEVER BREAK):
- DO NOT use MathTex or Tex.
- DO NOT use add_coordinates() because it forces LaTeX DecimalNumber.
- DO NOT use axes labels that require LaTeX.
- DO NOT use DecimalNumber or anything that relies on TeX.
- Use ONLY Text() for labels and numbers.
- If you need mathematical expressions, write them directly using Text().
- All numbers drawn on screen must use Text(), not Tex or MathTex.
"""

    user_instruction = f"""
Generate a Manim animation for the following concept:

{user_prompt}

Return ONLY the raw Manim Python code.
Do not include comments, explanations, JSON, or backticks.
"""

    messages = [
        ("system", system_prompt),
        ("human", user_instruction),
    ]

    response = llm.invoke(messages)
    manim_code = response.content
    return manim_code



