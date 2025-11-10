using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SALFORD_APP_NCIT.Models;

public partial class SalfordContext : DbContext
{
    public SalfordContext()
    {
    }

    public SalfordContext(DbContextOptions<SalfordContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Course> Courses { get; set; }

    public virtual DbSet<Lesson> Lessons { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Subscription> Subscriptions { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=localhost;Database=Salford1;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Categori__3214EC071299A8F2");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<Course>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Courses__3214EC078FF171B7");

            entity.HasIndex(e => e.CategoryId, "IX_Courses_CategoryId");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ImageUrl).HasMaxLength(255);
            entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Title).HasMaxLength(200);

            entity.HasOne(d => d.Category).WithMany(p => p.Courses)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("FK__Courses__Categor__412EB0B6");
        });

        modelBuilder.Entity<Lesson>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Lessons__3214EC0738306D26");

            entity.HasIndex(e => e.CourseId, "IX_Lessons_CourseId");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.LessonOrder).HasDefaultValue(1);
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.VideoUrl).HasMaxLength(255);

            entity.HasOne(d => d.Course).WithMany(p => p.Lessons)
                .HasForeignKey(d => d.CourseId)
                .HasConstraintName("FK__Lessons__CourseI__45F365D3");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Notifica__3214EC07589E78FE");

            entity.HasIndex(e => e.UserId, "IX_Notifications_UserId");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsRead).HasDefaultValue(false);
            entity.Property(e => e.Title).HasMaxLength(150);

            entity.HasOne(d => d.Course).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.CourseId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK__Notificat__Cours__5629CD9C");

            entity.HasOne(d => d.Lesson).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.LessonId)
                .HasConstraintName("FK__Notificat__Lesso__571DF1D5");

            entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Notificat__UserI__5535A963");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Payments__3214EC0788D58B31");

            entity.Property(e => e.Amount).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.PaymentDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PaymentMethod).HasMaxLength(50);
            entity.Property(e => e.ReferenceId).HasMaxLength(100);

            entity.HasOne(d => d.User).WithMany(p => p.Payments)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Payments__UserId__49C3F6B7");
        });

        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Subscrip__3214EC0766C88FD0");

            entity.HasIndex(e => e.CourseId, "IX_Subscriptions_CourseId");

            entity.HasIndex(e => e.UserId, "IX_Subscriptions_UserId");

            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.StartDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("Active");

            entity.HasOne(d => d.Course).WithMany(p => p.Subscriptions)
                .HasForeignKey(d => d.CourseId)
                .HasConstraintName("FK__Subscript__Cours__4F7CD00D");

            entity.HasOne(d => d.Payment).WithMany(p => p.Subscriptions)
                .HasForeignKey(d => d.PaymentId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK__Subscript__Payme__5070F446");

            entity.HasOne(d => d.User).WithMany(p => p.Subscriptions)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Subscript__UserI__4E88ABD4");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC07A0C427EF");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D105346F033A22").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.Role)
                .HasMaxLength(20)
                .HasDefaultValue("Student");
            entity.Property(e => e.SubscriptionStatus).HasMaxLength(20);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
