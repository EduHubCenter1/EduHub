"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, Camera } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from 'next/image';
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [institution, setInstitution] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(1);
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const { register, signInWithGoogle } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileChange triggered!");
    const file = e.target.files?.[0];
    console.log("Selected file:", file);
    if (file) {
      console.log("File is valid, size:", file.size);
      if (file.size > 3 * 1024 * 1024) { // 3MB limit
        toast({ title: "Error", description: "File size must be less than 3MB.", variant: "destructive" });
        console.log("File too large, returning.");
        return;
      }
      setImgSrc(URL.createObjectURL(file));
      console.log("imgSrc set.");
      setModalOpen(true);
      console.log("Modal opened.");
      setCrop(undefined);
      setCompletedCrop(undefined);
    }
    else {
      console.log("No file selected or file input cancelled.");
    }
  };

  // Helper function to draw image on canvas
  async function canvasPreview(
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    crop: PixelCrop,
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // devicePixelRatio enables better quality on retina devices
    const pixelRatio = window.devicePixelRatio;

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();

    // Translate the canvas origin to the center of the image
    ctx.translate(centerX, centerY);
    // Rotate the canvas
    // ctx.rotate(rotateRads); // Not using rotate for now
    // Translate back
    ctx.translate(-centerX, -centerY);

    ctx.drawImage(
      image,
      cropX,
      cropY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY,
    );

    ctx.restore();
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        width,
        height,
      ),
      width,
      height,
    );
    setCrop(newCrop);
  };

  const onSaveCrop = async () => {
    if (completedCrop && imgRef.current && previewCanvasRef.current) {
      await canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop,
      );

      previewCanvasRef.current.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], "profile_picture.png", { type: "image/png" });
          setProfilePictureFile(croppedFile);
          setPreviewUrl(URL.createObjectURL(croppedFile));
          setModalOpen(false); // Close the modal
          setImgSrc(''); // Clear image source
        } else {
          toast({ title: "Error", description: "Failed to crop image.", variant: "destructive" });
        }
      }, 'image/png');
    } else {
      toast({ title: "Error", description: "Please select a crop area.", variant: "destructive" });
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!email) {
        toast({ title: "Validation Error", description: "Email is required.", variant: "destructive" });
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        toast({ title: "Validation Error", description: "Invalid email format.", variant: "destructive" });
        return;
      }
      if (!firstName || !lastName || !username || !password) {
        toast({ title: "Validation Error", description: "Please fill all required fields.", variant: "destructive" });
        return;
      }
      if (password.length < 6) {
        toast({ title: "Validation Error", description: "Password must be at least 6 characters long.", variant: "destructive" });
        return;
      }
      if (password !== confirmPassword) {
        toast({ title: "Validation Error", description: "Passwords do not match.", variant: "destructive" });
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!termsAccepted) {
      toast({ title: "Registration Failed", description: "You must accept the terms and conditions.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    let profilePictureUrl = "";
    if (profilePictureFile) {
      console.log("Attempting to upload profile picture...");
      const supabase = createSupabaseBrowserClient();
      const filePath = `${Date.now()}_${profilePictureFile.name}`;
      console.log("File path for upload:", filePath);
      console.log("Profile picture file details:", profilePictureFile);
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, profilePictureFile);

      if (uploadError) {
        console.error("Profile picture upload failed:", uploadError);
        toast({ title: "Upload Failed", description: uploadError.message, variant: "destructive" });
        setIsLoading(false);
        return;
      }
      console.log("Profile picture uploaded successfully.");
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      profilePictureUrl = urlData.publicUrl;
      console.log("Profile picture public URL:", profilePictureUrl);
    } else {
      console.log("No profile picture selected for upload.");
    }

    const registrationData = { email, password, firstName, lastName, username, institution, fieldOfStudy, academicLevel, profilePictureUrl };
    const result = await register(registrationData);

    if (result.success) {
      toast({ title: "Registration Successful", description: "You have successfully registered! Please check your email to confirm your account." });
    } else {
      toast({ title: "Registration Failed", description: result.error || "An unexpected error occurred.", variant: "destructive" });
    }

    setIsLoading(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      handleNext(e);
    } else {
      handleRegister(e);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crop your profile picture</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
              >
                <img ref={imgRef} alt="Crop me" src={imgSrc} onLoad={onImageLoad} />
              </ReactCrop>
            )}
            {completedCrop && (
              <canvas
                ref={previewCanvasRef}
                style={{
                  width: completedCrop.width,
                  height: completedCrop.height,
                  objectFit: 'contain',
                  borderRadius: '50%', // For circular preview
                }}
              />
            )}
          </div>
          <DialogFooter>
            <Button onClick={onSaveCrop}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card className="overflow-hidden border-0 shadow-lg md:border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 space-y-6 md:p-8">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">{step === 1 ? "Create your account" : "Tell us more about you"}</h1>
              <p className="text-sm text-muted-foreground">Step {step} of 2</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {step === 1 && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" type="text" placeholder="John" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" type="text" placeholder="Doe" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" type="text" placeholder="johndoe" required value={username} onChange={(e) => setUsername(e.target.value)} />
                  </div>
                  <div className="relative grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-6" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="relative grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                     <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-6" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="flex flex-col items-center gap-4">
                    <Label htmlFor="profilePicture" className="cursor-pointer">
                      <div className="relative w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center text-muted-foreground hover:border-primary transition-colors">
                        {previewUrl ? (
                          <Image src={previewUrl} alt="Profile preview" layout="fill" objectFit="cover" className="rounded-full" />
                        ) : (
                          <Camera className="w-8 h-8" />
                        )}
                      </div>
                    </Label>
                    <Input id="profilePicture" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <p className="text-xs text-muted-foreground">Upload a profile picture (Max 3MB)</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="institution">Institution / School / University</Label>
                    <Input id="institution" type="text" placeholder="University of Example" value={institution} onChange={(e) => setInstitution(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fieldOfStudy">Field of Study / Department</Label>
                    <Input id="fieldOfStudy" type="text" placeholder="Computer Science" value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="academicLevel">Academic Level / Year</Label>
                    <Input id="academicLevel" type="text" placeholder="Freshman / Year 1" value={academicLevel} onChange={(e) => setAcademicLevel(e.target.value)} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(checked === true)} />
                    <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      I accept the <a href="#" className="underline">Terms and Conditions</a>
                    </label>
                  </div>
                </>
              )}

              <div className="flex gap-4">
                {step === 2 && (
                  <Button type="button" variant="outline" onClick={handleBack} className="w-full" disabled={isLoading}>
                    Back
                  </Button>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {step === 1 ? "Next" : "Register"}
                </Button>
              </div>
            </form>

            <div className="relative text-center text-sm">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-background text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                              <Button variant="outline" className="w-full" disabled={isLoading}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" fill="currentColor"/></svg> <span className="sr-only">Register with Apple</span> </Button>
                              <Button variant="outline" className="w-full" disabled={isLoading} onClick={signInWithGoogle}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor"/></svg> <span className="sr-only">Register with Google</span> </Button>
                              <Button variant="outline" className="w-full" disabled={isLoading}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2"><path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z" fill="currentColor"/></svg> <span className="sr-only">Register with Meta</span> </Button>
            </div>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </div>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/EduhubCenter.jpg"
              alt="EduHub"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
